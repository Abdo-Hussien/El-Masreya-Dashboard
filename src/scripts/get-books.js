export const query = `
SELECT 
    b.BookID,                                   AS id,
    Nz(b.BarCode, 0)                            AS barcode, 
    b.DisplayName                               AS bookTitle,
    b.UnitPrice                                 AS price, 
    ROUND((1 - b.Discount1) * b.UnitPrice, 2)   AS wholesalePrice,           -- wholesale price 
    b.UnitsInStock                              AS unitsAvailable, 
    b.QuantityPerPack                           AS PackSize, 
    it.SequenceNo & "." & b.OrderingCode        AS ProductCode, 
    it.SequenceNo, 
    b.OrderingCode, 
    b.CategoryID                                
FROM ItemTypes AS it
    RIGHT JOIN Books AS b 
        ON it.ItemTypeId = b.ItemType
    LEFT JOIN CategoryProduct AS cp 
        ON b.BookID = cp.ProductID
WHERE 
    b.DisplayName LIKE "*" & [Forms]![Invoice]![BookID2] & "*"
    AND Nz(b.BarCode, 0) = Nz([Forms]![Invoice]![BarCode], Nz(b.BarCode, 0))
    AND it.ItemType = Nz([Forms]![Invoice]![ItemType], it.ItemType)
    AND it.Active = True
    AND b.State = Nz([Forms]![Invoice]![BookStatus], 1)
ORDER BY 
    it.SequenceNo, 
    b.OrderingCode;
`
