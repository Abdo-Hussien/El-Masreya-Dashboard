export const query = `
SELECT
    StateName           AS label,
    StateID             AS [value]
FROM
    BookStatus;
`