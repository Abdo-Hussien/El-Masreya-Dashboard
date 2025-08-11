
// export const query = `SELECT b.BookID, b.DisplayName, b.UnitPrice
// FROM Books b`
export const query = `
SELECT 
    b.BookID                                            AS id,
    b.DisplayName                                       AS bookTitle,
    b.UnitPrice                                         AS price,
    IIF(ISNULL(b.BarCode), 0, b.BarCode)                AS barcode,
    ROUND(CDBL((1 - b.Discount1) * b.UnitPrice), 2)     AS wholesalePrice,
    it.SequenceNo & '.' & b.OrderingCode                AS productCode,
    b.UnitsInStock                                      AS unitsAvailable, 
    b.QuantityPerPack                                   AS PackSize, 
    it.SequenceNo, 
    b.OrderingCode, 
    b.CategoryID     
FROM (  
        ItemTypes it
        RIGHT JOIN Books b ON it.ItemTypeId = b.ItemType
    )
LEFT JOIN CategoryProduct cp ON b.BookID = cp.ProductID
ORDER BY 
    it.SequenceNo, 
    b.OrderingCode
`


// --WHERE
// --b.DisplayName LIKE "*" & [Forms]![Invoice]![BookID2] & "*"
// --AND Nz(b.BarCode, 0) = Nz([Forms]![Invoice]![BarCode], Nz(b.BarCode, 0))
// --AND it.ItemType = Nz([Forms]![Invoice]![ItemType], it.ItemType)
// --AND it.Active = True
// --AND b.State = Nz([Forms]![Invoice]![BookStatus], 1)