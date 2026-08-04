import { query } from '$app/server'

import { enabledBrowserServerSourceBindingIds } from '$/sources/index.server.ts'

export const sourceRuntimeCapabilities = query(() => ({
	enabledServerBindingIds: [...enabledBrowserServerSourceBindingIds].toSorted(),
}))
