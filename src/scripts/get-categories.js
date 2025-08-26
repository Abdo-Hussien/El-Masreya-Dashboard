// ItemTypeID      AS value
export const query = `
SELECT
    ItemType        AS label,
    ItemTypeId      AS [value]
FROM 
    ItemTypes
WHERE 
    Active = True
ORDER BY
    SequenceNo
`