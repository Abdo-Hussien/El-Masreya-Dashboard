"use server"

import type * as ODBC from "odbc"
import dotenv from 'dotenv'

dotenv.config()


async function getODBC() {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const odbc: typeof ODBC = require('odbc')
  return await odbc.connect('DSN=Masria_V26')
}


export {
  getODBC
}
