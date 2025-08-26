"use server"

import type * as ODBC from "odbc"

async function getConnection() {

  const odbc: typeof ODBC = (await import("odbc")).default
  return await odbc.connect('DSN=Masria_V26')
}


export {
  getConnection,
}
