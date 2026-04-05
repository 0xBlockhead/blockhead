interface BooleanConstructor {
	new (value?: T): value is NonNullable<T>

	<T>(value?: T): value is NonNullable<T>
}
