import { query } from '$app/server'

const localOnlyAuthorityUnavailable = async (): Promise<never> => {
	throw new Error('CodexNode_Rest: LocalOnly authority is unavailable through remote queries')
}

export const getEndpoint = query(localOnlyAuthorityUnavailable)
export const getPeerId = query(localOnlyAuthorityUnavailable)
export const listData = query(localOnlyAuthorityUnavailable)
