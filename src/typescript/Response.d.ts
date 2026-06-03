declare global {
	interface Body {
		json<_Type = any>(): Promise<_Type>
	}
}

export {}
