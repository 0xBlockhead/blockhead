export type MlflowTag = {
	key: string
	value: string
}

export type MlflowModelVersion = {
	name: string
	version: string
	creation_timestamp?: number
	last_updated_timestamp?: number
	description?: string
	user_id?: string
	current_stage?: string
	source?: string
	run_id?: string
	status?: string
	tags?: MlflowTag[]
}

export type MlflowRegisteredModel = {
	name: string
	creation_timestamp?: number
	last_updated_timestamp?: number
	description?: string
	tags?: MlflowTag[]
	latest_versions?: MlflowModelVersion[]
}

export type MlflowSearchRegisteredModelsResponse = {
	registered_models?: MlflowRegisteredModel[]
	next_page_token?: string
}

export type MlflowGetRegisteredModelResponse = {
	registered_model: MlflowRegisteredModel
}

export type MlflowSearchModelVersionsResponse = {
	model_versions?: MlflowModelVersion[]
	next_page_token?: string
}

export type MlflowGetModelVersionResponse = {
	model_version: MlflowModelVersion
}

export type MlflowFileInfo = {
	path: string
	is_dir: boolean
	file_size?: number
}

export type MlflowListArtifactsResponse = {
	root_uri?: string
	files?: MlflowFileInfo[]
	next_page_token?: string
}
