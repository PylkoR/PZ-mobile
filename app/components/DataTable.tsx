import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Table, Row, Rows } from 'react-native-table-component';

interface DataTableProps {
  data: any[];
}

const DataTable: React.FC<DataTableProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return <Text>Brak danych</Text>;
  }

  const tableHead = Object.keys(data[0]);
  const tableData = data.map(row =>
    tableHead.map(key => (row[key] !== undefined ? row[key].toString() : ""))
  );

  return (
    <View style={styles.container}>
      <Table borderStyle={styles.borderStyle}>
        <Row data={tableHead} style={styles.head} textStyle={styles.text} />
        <Rows data={tableData} textStyle={styles.text} />
      </Table>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16, paddingTop: 30, backgroundColor: '#fff' },
  borderStyle: { borderWidth: 2, borderColor: '#c8e1ff' },
  head: { height: 40, backgroundColor: '#f1f8ff' },
  text: { margin: 100, textAlign: 'center' },
});

export default DataTable;