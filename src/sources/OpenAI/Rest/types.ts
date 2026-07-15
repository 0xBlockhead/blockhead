export type OpenAIModel = {
	readonly id: string
	readonly object: 'model'
	readonly created: number
	readonly owned_by: string
}

export type OpenAIModelList = {
	readonly object: 'list'
	readonly data: readonly OpenAIModel[]
}
