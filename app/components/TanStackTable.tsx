import CustomButton from './CustomButton';
import React, { useState, useMemo, useRef, useCallback } from 'react';
import { Text, View, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  Column,
  SortingState,
  ColumnDef,
} from '@tanstack/react-table';

export type DataItem = {
  id: number;
  inventory: number;
  department: number;
  asset_group: number;
  category: string;
  inventory_number: string;
  asset_component: string | number;
  sub_number: number;
  acquisition_date: string;
  asset_description: string;
  quantity: number;
  initial_value: string | number;
  currentRoom: string;
  lastInventoryRoom: string;
  scanned: boolean;
};

interface TableProps {
  data: DataItem[];
}

const TableComponent: React.FC<TableProps> = ({ data }) => {
  const [columnFilters, setColumnFilters] = useState<any[]>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [selectedColumn, setSelectedColumn] = useState<Column<DataItem, unknown> | null>(null);

  const headerScrollRef = useRef<ScrollView>(null);
  const contentScrollRef = useRef<ScrollView>(null);

  const columnHelper = createColumnHelper<DataItem>();

  const columns = useMemo<ColumnDef<DataItem, any>[]>(
    () => [
      columnHelper.accessor('id', {
        header: 'ID',
        cell: info => info.getValue(),
        enableColumnFilter: true,
        enableSorting: true,
        size: 70
      }),
      columnHelper.accessor('inventory', {
        header: 'Inwentarz ID',
        cell: info => info.getValue(),
        enableColumnFilter: true,
        enableSorting: true,
        size: 120
      }),
      columnHelper.accessor('department', {
        header: 'Dział',
        cell: info => info.getValue(),
        enableColumnFilter: true,
        enableSorting: true,
        size: 100
      }),
      columnHelper.accessor('asset_group', {
        header: 'Grupa Aktywów',
        cell: info => info.getValue(),
        enableColumnFilter: true,
        enableSorting: true,
        size: 130
      }),
      columnHelper.accessor('category', {
        header: 'Kategoria',
        cell: info => info.getValue(),
        enableColumnFilter: true,
        enableSorting: true,
        size: 150
      }),
      columnHelper.accessor('inventory_number', {
        header: 'Numer Inwentarzowy',
        cell: info => info.getValue(),
        enableColumnFilter: true,
        enableSorting: true,
        size: 160
      }),
      columnHelper.accessor('asset_component', {
        header: 'Składnik Aktywów',
        cell: info => String(info.getValue()),
        enableColumnFilter: true,
        enableSorting: true,
        size: 150
      }),
      columnHelper.accessor('sub_number', {
        header: 'Podnumer',
        cell: info => info.getValue(),
        enableColumnFilter: true,
        enableSorting: true,
        size: 100
      }),
      columnHelper.accessor('acquisition_date', {
        header: 'Data Nabycia',
        cell: info => info.getValue(),
        enableColumnFilter: true,
        enableSorting: true,
        size: 120
      }),
      columnHelper.accessor('asset_description', {
        header: 'Opis',
        cell: info => info.getValue(),
        enableColumnFilter: true,
        enableSorting: true,
        size: 180
      }),
      columnHelper.accessor('quantity', {
        header: 'Ilość',
        cell: info => info.getValue(),
        size: 80,
        enableSorting: true
      }),
      columnHelper.accessor('initial_value', {
        header: 'Wartość',
        cell: info => String(info.getValue()),
        size: 120,
        enableSorting: true
      }),
      columnHelper.accessor('lastInventoryRoom', {
        header: 'Pomieszczenie',
        cell: info => info.getValue(),
        enableColumnFilter: true,
        enableSorting: true,
        size: 180
      }),
      columnHelper.accessor('currentRoom', {
        header: 'Obecne Pomieszczenie',
        cell: info => info.getValue(),
        enableColumnFilter: true,
        enableSorting: true,
        size: 180
      }),
      columnHelper.accessor('scanned', {
        header: 'Zeskanowano',
        cell: info => info.getValue() ? 'Tak' : 'Nie',
        size: 180,
        enableSorting: true
      }),
    ],
    [columnHelper]
  );

  const table = useReactTable({
    data,
    columns,
    state: { columnFilters, sorting },
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
    if (!selectedColumn) return '';
    const filter = columnFilters.find(f => f.id === (selectedColumn as Column<DataItem, unknown>).id);
    return filter ? filter.value : '';
  }, [selectedColumn, columnFilters]);

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
              const column = header.column as Column<DataItem, unknown>;
              const columnWidth = column.getSize() ?? 150;
              const canFilter = column.getCanFilter();
              const canSort = column.getCanSort();
              const isSelectedForFiltering = selectedColumn?.id === column.id;
              const sortIndicator = { asc: ' ↑', desc: ' ↓' }[column.getIsSorted() as string] ?? '';

              return (
                 <TouchableOpacity
                    activeOpacity={(canFilter || canSort) ? 0.7 : 1.0}
                    key={header.id}
                    onPress={() => {
                      if (canFilter || canSort) {
                        setSelectedColumn(column);
                      }
                    }}
                    style={[
                        styles.headerCell,
                        { width: columnWidth },
                        isSelectedForFiltering && styles.headerCellSelected
                    ]}
                  >
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
      {selectedColumn && (
         <View style={styles.externalFilterArea}>
            <Text style={styles.filterAreaLabel}>
                Kolumna: {String(selectedColumn.id)}
            </Text>
            {selectedColumn.getCanFilter() && (
                <TextInput
                    style={styles.externalFilterInput}
                    value={currentFilterValue}
                    onChangeText={value => selectedColumn.setFilterValue(value)}
                    placeholder="Filtruj..."
                    clearButtonMode="while-editing"
                />
            )}
            <View style={styles.actionButtonsContainer}>
                {selectedColumn.getCanSort() && (
                    <CustomButton
                        onPress={() => selectedColumn.toggleSorting(false)}
                        label="Sortuj ↑"
                    />
                )}
                {selectedColumn.getCanSort() && (
                     <CustomButton
                        onPress={() => selectedColumn.toggleSorting(true)}
                        label="Sortuj ↓"
                    />
                )}
                <CustomButton
                  onPress={() => {
                    if (selectedColumn?.getCanFilter()) {
                      selectedColumn.setFilterValue('');
                    }
                    if (selectedColumn?.getCanSort()) {
                      selectedColumn.clearSorting();
                    }
                  }}
                  label="Wyczyść"
                />
                <CustomButton
                    onPress={() => setSelectedColumn(null)}
                    label="Gotowe"
                />
            </View>
         </View>
      )}

      {renderFixedHeader()}

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
            <View>
                {table.getRowModel().rows.map((row) => (
                    <View style={styles.bodyRow} key={row.id}>
                        {row.getVisibleCells().map((cell) => {
                        const column = cell.column as Column<DataItem, unknown>;
                        const columnWidth = column.getSize() ?? 150;
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
        flex: 1,
        backgroundColor: 'white',
        margin: 5,
        borderWidth: 1,
        borderColor: 'black',
        overflow: 'hidden',
    },
    externalFilterArea: {
        padding: 10,
        borderBottomWidth: 1,
        borderColor: '#ccc',
        backgroundColor: '#f8f9fa',
    },
    filterAreaLabel: {
        fontWeight: '500',
        fontSize: 14,
        color: '#495057',
        marginBottom: 5,
    },
    externalFilterInput: {
        height: 38,
        backgroundColor: 'white',
        borderColor: '#adb5bd',
        borderWidth: 1,
        borderRadius: 4,
        paddingHorizontal: 8,
        fontSize: 14,
        marginBottom: 10,
    },
    actionButtonsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-around',
        gap: 4,
    },
   
    fixedHeaderContainer: {
        borderBottomWidth: 2,
        borderColor: 'black',
        backgroundColor: '#e9ecef',
    },
    headerScrollContent: {
      flexDirection: 'row' },
    headerRowContent: {
      flexDirection: 'row' },
    headerCell: {
        paddingVertical: 12,
        paddingHorizontal: 8,
        borderRightWidth: 1,
        borderColor: '#dee2e6',
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerCellSelected: {
        backgroundColor: '#D0DDD0',
    },
    headerText: {
        fontWeight: '600', color: '#343a40',
    },
    verticalScrollContainer: { flex: 1 },
    horizontalScrollContainer: {},
    bodyRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderColor: '#e9ecef',
    },
    bodyCell: {
        paddingHorizontal: 8,
        paddingVertical: 10,
        borderRightWidth: 1,
        borderColor: '#e9ecef',
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    bodyText: {
        color: '#495057',
    },
});

export default TableComponent;