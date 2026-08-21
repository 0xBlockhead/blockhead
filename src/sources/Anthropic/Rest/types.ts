export type AnthropicModel = {
	readonly type: 'model'
	readonly id: string
	readonly display_name: string
	readonly created_at: string
}

export type AnthropicModelList = {
	readonly data: readonly AnthropicModel[]
	readonly has_more: boolean
	readonly first_id?: string
	readonly last_id?: string
}
