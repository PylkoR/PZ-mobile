import React, { useState, useMemo, useRef, useCallback } from 'react';
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity, 
} from 'react-native';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel, // Dodano do sortowania
  useReactTable,
  Column,
  SortingState, // Dodano typ do sortowania
} from '@tanstack/react-table';

type DataItem = {
    id: number; inventory: number; department: number; asset_group: number; category: string; inventory_number: string; asset_component: number; sub_number: number; acquisition_date: string; asset_description: string; quantity: number; initial_value: string; room: string; new_room: string; scanned: boolean;
};

interface TableProps {
  data: DataItem[];
}

const TableComponent: React.FC<TableProps> = ({ data }) => {
  
  const [columnFilters, setColumnFilters] = useState<any[]>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [selectedColumnForFiltering, setSelectedColumnForFiltering] = useState<Column<any, any> | null>(null);

  const headerScrollRef = useRef<ScrollView>(null);
  const contentScrollRef = useRef<ScrollView>(null);

  const columnHelper = createColumnHelper<DataItem>();
  const columns = useMemo(
    () => [
        columnHelper.accessor('inventory', { header: 'Inventory', cell: info => info.getValue(), enableColumnFilter: true, enableSorting: true, size: 120 }),
        columnHelper.accessor('category', { header: 'Category', cell: info => info.getValue(), enableColumnFilter: true, enableSorting: true, size: 150 }),
        columnHelper.accessor('inventory_number', { header: 'Inv Number', cell: info => info.getValue(), enableColumnFilter: true, enableSorting: true, size: 150 }),
        columnHelper.accessor('asset_description', { header: 'Description', cell: info => info.getValue(), enableColumnFilter: true, enableSorting: true, size: 250 }),
        columnHelper.accessor('quantity', { header: 'Qty', cell: info => info.getValue(), size: 80, enableSorting: true }), // Sortowanie ilości też może być przydatne
        columnHelper.accessor('initial_value', { header: 'Value', cell: info => info.getValue(), size: 100, enableSorting: true }), // Sortowanie wartości
        columnHelper.accessor('room', { header: 'Room', cell: info => info.getValue(), enableColumnFilter: true, enableSorting: true, size: 100 }),
        columnHelper.accessor('scanned', { header: 'Scanned', cell: info => info.getValue() ? 'Yes' : 'No', size: 90, enableSorting: true }), // Sortowanie zeskanowanych? Może tak
    ],
    [columnHelper]
  );

  const table = useReactTable({
    data,
    columns,
    state: {
        columnFilters,
        sorting, 
     },
    onColumnFiltersChange: setColumnFilters,
    onSortingChange: setSorting, 
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(), 
  });

  
  const handleContentScroll = useCallback((event: any) => {
    headerScrollRef.current?.scrollTo({ x: event.nativeEvent.contentOffset.x, animated: false });
  }, []);

  
  const currentFilterValue = useMemo(() => {
      if (!selectedColumnForFiltering) return '';
      const filter = columnFilters.find(f => f.id === selectedColumnForFiltering.id);
      return filter ? filter.value : '';
  }, [selectedColumnForFiltering, columnFilters]);

  
  const renderFixedHeader = () => (
    <View style={styles.fixedHeaderContainer}>
      <ScrollView
        ref={headerScrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        scrollEnabled={false}
        contentContainerStyle={styles.headerScrollContent}
      >
        {table.getHeaderGroups().map((headerGroup) => (
          <View style={styles.headerRowContent} key={headerGroup.id}>
            {headerGroup.headers.map((header) => {
              const column = header.column;
              const columnWidth = column.getSize() ?? 150;
              const canFilter = column.getCanFilter();
              const canSort = column.getCanSort();
              const isSelectedForFiltering = selectedColumnForFiltering?.id === column.id;
              const sortIndicator = { asc: ' ↑', desc: ' ↓' }[column.getIsSorted() as string] ?? ''; // Wskaźnik sortowania

              return (
                 <TouchableOpacity
                    activeOpacity={(canFilter || canSort) ? 0.7 : 1.0} // Klikalny, jeśli można filtrować LUB sortować
                    key={header.id}
                    onPress={() => {
                      // Po kliknięciu wybieramy kolumnę (do filtrowania/sortowania w panelu)
                      if (canFilter || canSort) {
                        setSelectedColumnForFiltering(column);
                      }
                    }}
                    style={[
                        styles.headerCell,
                        { width: columnWidth },
                        isSelectedForFiltering && styles.headerCellSelected
                    ]}
                  >
                    {/* Tekst nagłówka + wskaźnik sortowania */}
                    <Text style={styles.headerText} numberOfLines={1}>
                      {flexRender(column.columnDef.header, header.getContext())}
                      {sortIndicator}
                    </Text>
                 </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </ScrollView>
    </View>
  );

 
  return (
    <View style={styles.container}>
        {selectedColumnForFiltering && (
            <View style={styles.externalFilterArea}>
                <Text style={styles.filterAreaLabel}>
                    Kolumna: {selectedColumnForFiltering.id}
                </Text>
                {selectedColumnForFiltering.getCanFilter() && (
                    <TextInput
                        style={styles.externalFilterInput}
                        value={currentFilterValue}
                        onChangeText={value => selectedColumnForFiltering.setFilterValue(value)}
                        clearButtonMode="while-editing"
                    />
                )}
                <View style={styles.actionButtonsContainer}>
                    {/* Przycisk Sortuj Rosnąco (tylko jeśli można sortować) */}
                    {selectedColumnForFiltering.getCanSort() && (
                        <TouchableOpacity onPress={() => selectedColumnForFiltering.toggleSorting(false)} style={styles.actionButton}>
                           <Text style={styles.actionButtonText}>Sortuj ↑</Text>
                        </TouchableOpacity>
                    )}
                    {/* Przycisk Sortuj Malejąco (tylko jeśli można sortować) */}
                    {selectedColumnForFiltering.getCanSort() && (
                        <TouchableOpacity onPress={() => selectedColumnForFiltering.toggleSorting(true)} style={styles.actionButton}>
                           <Text style={styles.actionButtonText}>Sortuj ↓</Text>
                        </TouchableOpacity>
                    )}
                    {/* Przycisk Wyczyść Filtr (tylko jeśli można filtrować i jest wartość) */}
                    {selectedColumnForFiltering.getCanFilter() && currentFilterValue !== '' && (
                        <TouchableOpacity onPress={() => selectedColumnForFiltering.setFilterValue('')} style={styles.actionButton}>
                           <Text style={styles.actionButtonText}>Wyczyść Filtr</Text>
                        </TouchableOpacity>
                    )}
                    {/* Przycisk Zamknij Panel */}
                    <TouchableOpacity onPress={() => setSelectedColumnForFiltering(null)} style={[styles.actionButton, styles.doneButton]}>
                       <Text style={styles.actionButtonText}>Gotowe</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )}

        {/* Stały nagłówek tabeli */}
        {renderFixedHeader()}

        {/* Przewijalna treść tabeli */}
        <ScrollView
            style={styles.verticalScrollContainer}
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
        >
            <ScrollView
            ref={contentScrollRef}
            horizontal
            style={styles.horizontalScrollContainer}
            onScroll={handleContentScroll}
            scrollEventThrottle={16}
            >
                <View style={styles.tableBodyContainer}>
                    {table.getRowModel().rows.map((row) => (
                        <View style={styles.bodyRow} key={row.id}>
                            {row.getVisibleCells().map((cell) => {
                            const columnWidth = cell.column.getSize() ?? 150;
                            return (
                                <View
                                    style={[styles.bodyCell, { width: columnWidth }]}
                                    key={cell.id}
                                >
                                    <Text style={styles.bodyText} numberOfLines={1}>
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </Text>
                                </View>
                            );
                            })}
                        </View>
                    ))}
                </View>
            </ScrollView>
        </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1, backgroundColor: 'white', margin: 5, borderWidth: 1, borderColor: 'black', overflow: 'hidden',
    },
    // Panel filtrowania/sortowania
    externalFilterArea: {
        padding: 10, borderBottomWidth: 1, borderColor: '#ccc', backgroundColor: '#f8f9fa',
    },
    filterAreaLabel: {
        fontWeight: '500', fontSize: 14, color: '#495057', marginBottom: 5,
    },
    externalFilterInput: {
        height: 38, backgroundColor: 'white', borderColor: '#adb5bd', borderWidth: 1, borderRadius: 4, paddingHorizontal: 8, fontSize: 14, marginBottom: 8, // Odstęp pod polem filtra
    },
    actionButtonsContainer: { // Kontener na przyciski akcji
        flexDirection: 'row',
        flexWrap: 'wrap', // Pozwala przyciskom zawijać się w razie potrzeby
        justifyContent: 'flex-start', // Wyrównanie od lewej
    },
    actionButton: { // Styl przycisków akcji
        backgroundColor: '#6c757d', // Kolor przycisku
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderRadius: 4,
        marginRight: 8, // Odstęp między przyciskami
        marginBottom: 5, // Odstęp jeśli się zawijają
    },
    doneButton: {
        backgroundColor: '#0d6efd', // Inny kolor dla "Gotowe"
    },
    actionButtonText: { // Styl tekstu przycisków
        color: 'white',
        fontSize: 12,
        fontWeight: '500',
    },
    // Stały nagłówek
    fixedHeaderContainer: {
        borderBottomWidth: 2, borderColor: 'black', backgroundColor: '#e9ecef',
    },
    headerScrollContent: { flexDirection: 'row' },
    headerRowContent: { flexDirection: 'row' },
    headerCell: {
        paddingVertical: 12, paddingHorizontal: 8, borderRightWidth: 1, borderColor: '#dee2e6', alignItems: 'center', justifyContent: 'center',
    },
    headerCellSelected: {
        backgroundColor: '#cfe2ff',
    },
    headerText: {
        fontWeight: '600', color: '#343a40',
    },
    // Przewijalna treść
    verticalScrollContainer: { flex: 1 },
    horizontalScrollContainer: {},
    tableBodyContainer: {},
    bodyRow: {
        flexDirection: 'row', borderBottomWidth: 1, borderColor: '#e9ecef',
    },
    bodyCell: {
        paddingHorizontal: 8, paddingVertical: 10, borderRightWidth: 1, borderColor: '#e9ecef', justifyContent: 'center', alignItems: 'flex-start',
    },
    bodyText: {
        color: '#495057',
    },
});

export default TableComponent;