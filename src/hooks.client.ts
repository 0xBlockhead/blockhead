import { initBrowserSqlitePersistence } from '$/data/tanstackQuery/browserSqlitePersistence.ts'

export async function init() {
	await initBrowserSqlitePersistence()
}
