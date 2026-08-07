const rowKey = (row, index) => row.id || row._id || index

const DataTable = ({ columns, rows }) => (
  <div className="table-shell">
    <table>
      <thead>
        <tr>
          {columns.map((column) => <th key={column.key}>{column.label}</th>)}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, rowIndex) => (
          <tr key={rowKey(row, rowIndex)}>
            {columns.map((column) => (
              <td key={`${rowKey(row, rowIndex)}-${column.key}`}>
                {column.render ? column.render(row) : row[column.key]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)

export default DataTable
