import React from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { Table, Row, Rows } from 'react-native-table-component';

interface DataTableProps {
  data: any[];
}

const DataTable: React.FC<DataTableProps> = ({ data }) => {
  
  if (!data || data.length === 0) {
    return <Text>Brak danych</Text>;
  }

  const tableHead = Object.keys(data[0]); // data headers

  const columnWidths = [
    50, // id
    100, // inventory
    100, // department
    100, // asset_group
    70, // category
    130, // inventory_number
    150, // asset_component
    95, // sub_number
    120, // acquisition_date
    150, // asset_description
    80, // quantity
    100, // initial_value
    100, // room
    120, // new_room
    70, // scanned
  ];

  const tableData = data.map(row =>
    tableHead.map(key => (row[key].toString() ))
  );

  return (
    <View style={styles.container}>
      <ScrollView horizontal>
        <ScrollView>
          <Table borderStyle={styles.tableBorder}>
            <Row
              data={tableHead}
              style={styles.head}
              textStyle={styles.text}
              widthArr={columnWidths}
            />
            <Rows
              data={tableData}
              style={styles.row}
              textStyle={styles.text}
              widthArr={columnWidths}
            />
          </Table>
        </ScrollView>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    paddingTop: 15,
  },
  tableBorder: {
    borderWidth: 1,
    borderColor: '#B9B9B9',
  },
  head: {
    height: 40,
    backgroundColor: 'white',
  },
  row: {
    backgroundColor: 'white',
  },
  text: {
    margin: 6,
  },
});

export default DataTable;
