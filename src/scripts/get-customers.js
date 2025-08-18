export const query = `
SELECT 
    CustomerID          AS id, 
    CustomerName        AS name, 
    Supplyer            AS isSupplier
FROM 
    Customers
`