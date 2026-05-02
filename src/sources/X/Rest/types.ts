export type XApiV2UserWire = {
	data?: {
		id?: string
		name?: string
		username?: string
		description?: string
		profile_image_url?: string
	}
}

export type XApiV2TweetWire = {
	data?: {
		id?: string
		text?: string
		author_id?: string
		created_at?: string
	}
	includes?: {
		users?: { id: string, name: string, username: string, description: string, profile_image_url: string }[]
	}
}

export type XApiV2UserTweetsWire = {
	data?: { id: string }[]
}
