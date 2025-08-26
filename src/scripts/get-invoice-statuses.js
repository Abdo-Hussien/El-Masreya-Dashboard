export const query = `
    SELECT
        Status.StatusID             AS id,
        Status.StateDisplayTxt      AS alias
    FROM
        Status;
`
