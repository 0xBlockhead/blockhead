import type {
	SourceDefinition,
	SourceProviderDefinition,
} from './source.ts'

export enum EntityFieldCardinality {
	Zero = 'Zero',
	One = 'One',
	ZeroOrOne = 'ZeroOrOne',
	Many = 'Many',
	ZeroOrMany = 'ZeroOrMany',
}

export enum EntityFieldType {
	Primitive = 'Primitive',
	EntityReference = 'EntityReference',
	EntitiesReference = 'EntitiesReference',
}

export enum _ViewItemKind {
	Field = 'Field',
	Text = 'Text',
	Block = 'Block',
}

export enum _ExpressionDecode {
	DecodeURIComponent = 'decodeURIComponent',
	BigInt = 'bigint',
	Number = 'number',
}

export enum _RouteParamEncoding {
	Opaque = 'Opaque',
	Path = 'Path',
}

export type _RouteParamTransform = {
	from: string
	name: string
}

export enum EntityLayout {
	Value = 'Value',
	Title = 'Title',
	SummaryDetails = 'SummaryDetails',
	Summary = 'Summary',
	SummaryInline = 'SummaryInline',
}

export enum _ListFilterComparison {
	TimeInterval = 'timeInterval',
}

export const rawSnippetReference = {
	open: 'open',
	params: 'params',
	pendingEntity: 'pendingEntity',
	prefetched: 'prefetched',
	resolvedEntity: {
		source: '__appRawSnippetResolvedEntity__',
	},
	titleFallback: 'titleFallback',
	viewSelection: 'viewSelection',
} as const

export type _RawSnippet = string | {
	raw: string
	imports?: readonly _Import[]
	references?: readonly (keyof typeof rawSnippetReference)[]
}

export type _SourceSelection<
	_FieldName extends string = string,
> = {
	name?: string
	default: readonly string[]
	cases?: {
		when: {
			prop?: string
			field?: _FieldName
			equals: string | number | boolean
		}[]
		sources: readonly string[]
	}[]
}

export const dedent = (strings: TemplateStringsArray, ...values: string[]) =>
	((raw) => {
		const lines = raw.replace(/^\n|\n[\t ]*$/g, '').split('\n')
		const commonIndent = Math.min(...lines
			.filter((line) => line.trim() !== '')
			.map((line) => line.match(/^[\t ]*/)?.[0].length ?? 0))

		return {
			raw: lines
				.map((line) => line.slice(commonIndent))
				.join('\n'),
		} satisfies _RawSnippet
	})(strings
		.reduce(
			(markup, string, index) =>
				`${markup}${string}${index in values ? String(values[index]) : ''}`,
				''
			)
	)

type _ViewFieldFormat =
	| 'address'
	| 'auto'
	| 'bodyLongText'
	| 'bodyText'
	| 'boolean'
	| 'code'
	| 'currency'
	| 'currencyScaled'
	| 'dateTime'
	| 'longText'
	| 'markdown'
	| 'syndicationHtml'
	| 'namespaceReference'
	| 'number'
	| 'numberValue'
	| 'percent'
	| 'stringList'
	| 'timestamp'
	| 'url'
	| 'text'
	| 'truncated'

type _Text = {
	label?: string
	title?: string
	description?: string
}

export type _Import = {
	from: string
	default?: string
	names?: readonly string[]
	typeNames?: readonly string[]
}

type _Literal = string | number | boolean | null

export type _Expression =
	| string
	| {
			raw: string
		}
	| {
			kind: 'param'
			name: string
			decode?: _ExpressionDecode
		}
	| {
			kind: 'literal'
			value: _Literal
		}
	| {
			kind: 'object'
			fields: {
				name: string
				value: _Expression
			}[]
		}
	| {
			kind: 'selector'
			entity: string
			selector: string
			params: ({
				field: string
				param: string
				decode?: _ExpressionDecode
			} | {
				field: string
				param?: string
				value: _Expression
				hrefValue?: _Expression
			})[]
		}
	| {
			kind: 'field'
			name: string
		}
	| {
			kind: 'property'
			value: _Expression
			property: string
		}
	| {
			kind: 'pageSelector'
		}
	| {
			kind: 'catalogIndex'
			from: string
			map: string
			key?: _Expression
			param?: string
			field?: string
			property?: string
		}
	| {
			kind: 'call'
			from: string
			name: string
			args: _Expression[]
		}
	| {
			kind: 'template'
			parts: (string | _Expression)[]
		}
	| {
			kind: 'case'
			value: _Expression
			cases: {
				equals: _Literal
				value: _Expression
			}[]
			default: _Expression
		}

type _RouteParameterName<_Parameter extends string> = (
	_Parameter extends `...${infer _Name}=${string}` ?
		_Name
	: _Parameter extends `...${infer _Name}` ?
		_Name
	: _Parameter extends `${infer _Name}=${string}` ?
		_Name
	:
		_Parameter
)

type _RouteParameterNames<_Route extends string> = (
	_Route extends `${string}[${infer _Parameter}]${infer _Rest}` ?
		_RouteParameterName<_Parameter> | _RouteParameterNames<_Rest>
	:
		never
)

export const defineRowHref = <const _Route extends string>(
	route: _Route,
	params: {
		[_Parameter in _RouteParameterNames<_Route>]: _Expression
	}
) => ({
	route,
	params,
})

export const routeTemplate = (parts: (string | _Expression)[]): _Expression => ({
	kind: 'template',
	parts,
})

export const routeProperty = (value: _Expression, property: string): _Expression => ({
	kind: 'property',
	value,
	property,
})

export const routeField = (name: string): Exclude<_Expression, string> => ({
	kind: 'field',
	name,
})

export const routeCall = (from: string, name: string, args: _Expression[]): _Expression => ({
	kind: 'call',
	from,
	name,
	args,
})

export type _ViewQuery<
	_FieldReference extends string | _ProjectionFieldReference = string | _ProjectionFieldReference,
> = {
	sources?: readonly string[] | _SourceSelection<Extract<_FieldReference, string>>
	openSources?: readonly string[]
	fields?: _FieldReference[]
	openFields?: _FieldReference[]
	limit?: number | { default: number }
	orderBy?: {
		field: _FieldReference
		direction: 'asc' | 'desc'
	}[]
}

type _ViewWhen = 'always' | 'closed' | 'open'

type _ProjectionFieldReference = readonly [string, string, ...string[]]

export type _FieldReference = string | _ProjectionFieldReference

export type _ViewItem<
	_EntityFieldReference extends _FieldReference = _FieldReference,
> =
	| _EntityFieldReference
	| {
			kind: _ViewItemKind.Text
			label: string
			description?: string
			when?: _ViewWhen
		}
	| {
			kind?: _ViewItemKind.Field
			field: _EntityFieldReference
			label?: string
			description?: string
			format?: _ViewFieldFormat
			selection?: {
				sources: readonly string[]
			}
			component?: string
			layout?: EntityLayout
			enumConstantMap?: string
			enumConstantFrom?: string
			enumConstantProperty?: string
			valuePrefix?: _ViewItem<_EntityFieldReference>[]
			valuePrefixSeparator?: string
			decimalPlaces?: Exclude<_Expression, string>
			prefix?: string | Exclude<_Expression, string>
			suffix?: string | Exclude<_Expression, string>
			link?: {
				href: string
				params?: Readonly<Record<string, _Expression>>
			}
			when?: _ViewWhen
		}
	| {
			kind: _ViewItemKind.Block
			id: string
			label?: string
			description?: string
			fields?: _EntityFieldReference[]
			when?: _ViewWhen
			Content: _RawSnippet
	}

type _ViewBody<
	_EntityFieldReference extends _FieldReference = _FieldReference,
> = {
	id?: string
	label?: string
	field: _EntityFieldReference
	format?: _ViewFieldFormat
	emptyText?: string
	when?: _ViewWhen
}

export type _ViewListSection<
	_EntityFieldReference extends _FieldReference = _FieldReference,
> = {
	id?: string
	label?: string
	title?: string
	titleField?: _EntityFieldReference
	field?: _EntityFieldReference
	component?: string
	href?: `/(${string}`
	props?: {
		name: string
		value: _Expression
	}[]
	placeholderText?: string
	emptyText?: string
	query?: _ViewQuery<_EntityFieldReference>
	conditions?: {
		field: _EntityFieldReference
		equals?: _Literal
		contains?: _Literal
	}[]
}

type _ListViewQuery<
	_EntityFieldReference extends _FieldReference = _FieldReference,
> = {
	fields?: _EntityFieldReference[]
	openFields?: _EntityFieldReference[]
	limit?: {
		default?: number
	}
	selection?: {
		limit?: number
	}
	sources?: readonly string[] | _SourceSelection<Extract<_EntityFieldReference, string>>
}

type _ListViewRow<
	_EntityFieldReference extends _FieldReference = _FieldReference,
> = {
	value?: _ViewItem<_EntityFieldReference>[]
	title?: _ViewItem<_EntityFieldReference>[]
	titleFallback?: _ViewItem<_EntityFieldReference>[]
	HeadingAfter?: _ViewItem<_EntityFieldReference>[]
}

export type _ListView<
	_EntityFieldReference extends _FieldReference = _FieldReference,
	_EntitySelectorFieldReference extends string = Extract<_EntityFieldReference, string>,
> = {
	imports?: _Import[]
	component?: string
	title?: string
	placeholderText?: string
	query?: _ListViewQuery<_EntityFieldReference>
	TypeAnnotationTooltip?: _RawSnippet
	emptyText?: string
	filters?: {
		prop: string
		selectorPath:
			| _EntitySelectorFieldReference
			| `${_EntitySelectorFieldReference}.${string}`
		compare?: _ListFilterComparison
	}[]
	rowHref?: {
		route: string
		params: {
			[param: string]: _Expression
		}
	}
	row?: _ListViewRow<_EntityFieldReference>
}

type _EntityView<
	_EntityFieldReference extends _FieldReference = _FieldReference,
> = {
	imports?: _Import[]
	pending?: {
		imports?: _Import[]
		expression: string
	}
	query?: _ViewQuery<_EntityFieldReference>
	latest?: {
		id?: string
		field: _EntityFieldReference
		label?: string
		query?: _ViewQuery<_EntityFieldReference>
		fields?: string[]
		sort?: _FieldReference
		direction?: 'asc' | 'desc'
		view?: string
		Content?: _RawSnippet
		when?: {
			field: _EntityFieldReference
			equals: _Literal
		}[]
		conditions?: {
			field: _EntityFieldReference
			equals?: _Literal
			contains?: _Literal
		}[]
	}[]
	latestDlClassName?: string
	artifacts?: {
		field: _EntityFieldReference
		label: string
		fileName: string
		mediaType: 'application/json' | 'text/plain'
	}[]
	TypeAnnotationTooltip?: _RawSnippet
	summary?: {
		icon?: _ViewItem<_EntityFieldReference>
		Icon?: _RawSnippet
		serial?: {
			field: _EntityFieldReference
			label: string
			fallback?: _ViewItem<_EntityFieldReference>[]
		}
		value?: _ViewItem<_EntityFieldReference>[]
		Value?: _RawSnippet
		title?: _ViewItem<_EntityFieldReference>[]
		Title?: _RawSnippet
		titleFallback?: _ViewItem<_EntityFieldReference>[]
		HeadingAfter?: _ViewItem<_EntityFieldReference>[]
	}
	closed?: _ViewItem<_EntityFieldReference>[]
	content?: {
		dl?: _ViewItem<_EntityFieldReference>[][]
		body?: _ViewBody<_EntityFieldReference>
		blocks?: _ViewItem<_EntityFieldReference>[][]
		lists?: _ViewListSection<_EntityFieldReference>[]
	}
	carousels?: {
		id?: string
		after?: string
		label: string
		description?: string
		className?: string
		when?: _ViewWhen
		sections: {
			id?: string
			label?: string
			description?: string
			when?: _ViewWhen
			field?: _EntityFieldReference
			link?: {
				route: string
				params?: Readonly<Record<string, _Expression>>
			}
			selection?: _ViewQuery<_EntityFieldReference>
			layout?: EntityLayout
			emptyText?: string
			items?: _ViewItem[]
			List?: string
			Content?: _RawSnippet
		}[]
	}[]
	details?: {
		body?: _ViewBody<_EntityFieldReference>
		blocks?: _ViewItem<_EntityFieldReference>[][]
		tabs?: {
			id?: string
			label: string
			description?: string
			conditions?: {
				field: _EntityFieldReference
				equals?: _Literal
				notEquals?: _Literal
			}[]
			items?: _ViewItem<_EntityFieldReference>[]
			Content?: _RawSnippet
			when?: _ViewWhen
		}[]
	}
	contentWarning?: {
		sensitiveField: _EntityFieldReference
		textField: _EntityFieldReference
		fallbackText: string
	}
	lists?: _ViewListSection<_EntityFieldReference>[]
}

export type _AppFacetCondition =
	| {
		path: readonly [string | number, ...(string | number)[]]
		is: _Literal
	}
	| {
		path: readonly [string | number, ...(string | number)[]]
		isOneOf: readonly [_Literal, ..._Literal[]]
	}
	| {
		path: readonly [string | number, ...(string | number)[]]
		includes: _Literal
	}
	| {
		all: readonly [_AppFacetCondition, ..._AppFacetCondition[]]
	}

type _ValueTypeType =
	| {
		primitive: 'bigint' | 'boolean' | 'number' | 'unknown'
	}
	| {
		primitive: 'string'
		characters?: string
		minimumLength?: number
		maximumLength?: number
	}
	| {
		unit: _Literal
	}
	| {
		enum: string
	}
	| {
		array: _ValueTypeType
	}
	| {
		object: readonly {
			name: string
			type: _ValueTypeType
		}[]
	}
	| {
		raw: _RawSnippet
	}

type _ValueTypeRouteParam = {
	matcher: string
	decode?: _ExpressionDecode | _RouteParamTransform
	encode?: _RouteParamTransform
	encoding?: _RouteParamEncoding
}

type _AppEnum = {
	name: string
	members: readonly {
		name: string
		value: _Literal
		label?: string
	}[]
	routeParam?: _ValueTypeRouteParam
}

type _EntityField = {
	name: string
	label?: string
	labelPlural?: string
	description?: string
	type: EntityFieldType
	cardinality: EntityFieldCardinality
	valueType?: string
	primitiveType?: _ValueTypeType
	entityType?: string
	defaultSources?: readonly string[]
	normalize?: string
}

type _EntityFacet = {
	name: string
	condition: _AppFacetCondition
	fields?: readonly _EntityField[]
	facets?: readonly _EntityFacet[]
	singularView?: Partial<_EntityView>
}

type _EntityFacetDefinition = Omit<_EntityFacet, 'name'>

type _FacetFieldPath<
	_Facets,
	_Prefix extends readonly string[] = [],
> = (
	_Facets extends readonly (infer _Facet)[] ?
		_Facet extends {
			name: infer _FacetName extends string
			fields?: readonly (infer _Field)[]
			facets?: infer _NestedFacets
		} ?
			string extends _FacetName ?
				never
			:
				| (_Field extends {
					name: infer _FieldName extends string
				} ? readonly [..._Prefix, _FacetName, _FieldName] : never)
				| _FacetFieldPath<_NestedFacets, readonly [..._Prefix, _FacetName]>
		:
			never
	:
		never
)

type _FacetDefinitionFieldPath<
	_FacetName extends string,
	_Definition,
> = (
	| (_Definition extends {
		fields: readonly (infer _Field)[]
	} ?
		_Field extends { name: infer _FieldName extends string } ?
			readonly [_FacetName, _FieldName]
		:
			never
	:
		never)
	| (_Definition extends { facets?: infer _NestedFacets } ?
		_FacetFieldPath<_NestedFacets, readonly [_FacetName]>
	:
		never)
)

type _FacetFieldDefinition = Omit<_EntityField, 'name'>

type _FieldDefinitionsWithValidNames<_Fields extends Record<string, _FacetFieldDefinition>> = {
	readonly [_FieldName in keyof _Fields]: _FieldName extends string ?
		_Fields[_FieldName]['type'] extends EntityFieldType.Primitive ?
			_FieldName extends `$${string}` ? never : _Fields[_FieldName]
		: _Fields[_FieldName]['type'] extends EntityFieldType.EntityReference ?
			_FieldName extends `$$${string}` ?
				never
			: _FieldName extends `$${infer _ReferenceName}` ?
				_ReferenceName extends '' ? never : _Fields[_FieldName]
			:
				never
		: _Fields[_FieldName]['type'] extends EntityFieldType.EntitiesReference ?
			_FieldName extends `$$${infer _ReferencesName}` ?
				_ReferencesName extends '' ? never : _Fields[_FieldName]
			:
				never
		:
			never
	:
		never
}

type _TitleCaseFacetDefinitions<_Definitions extends Record<string, _EntityFacetDefinition>> = {
	readonly [_Name in keyof _Definitions]: _Name extends string
		? _Name extends Capitalize<_Name>
			? _Definitions[_Name]
			: never
		: _Definitions[_Name]
}

type _FacetDefinitionsWithoutFields<
	_Fields extends Record<string, _FacetFieldDefinition>,
	_Definitions extends Record<string, _EntityFacetDefinition>,
> = {
	readonly [_Name in keyof _Definitions]: _Name extends keyof _Fields ? never : _Definitions[_Name]
}

type _EntityMeta = {
	entityType: string
	labels: {
		singular: string
		plural: string
	}
	icon?: string
	description?: string
	enums?: readonly _AppEnum[]
}

type _SelectorFieldName<
	_Fields extends Record<string, _FacetFieldDefinition>,
> = {
	[_FieldName in keyof _Fields & string]: _Fields[_FieldName]['type'] extends (
		| EntityFieldType.Primitive
		| EntityFieldType.EntityReference
	) ?
		_Fields[_FieldName]['cardinality'] extends (
			| EntityFieldCardinality.One
			| EntityFieldCardinality.ZeroOrOne
		) ?
			_FieldName
		:
			never
	:
		never
}[keyof _Fields & string]

type _EntitySelectorsAndFacets<
	_Fields extends Record<string, _FacetFieldDefinition>,
> = {
	selectors?: Record<
		string,
		readonly [
			_SelectorFieldName<_Fields>,
			..._SelectorFieldName<_Fields>[],
		]
	>
	facets?: Record<string, _EntityFacetDefinition>
	views?: {
		singular?: _EntityView
		plural: _ListView
	}
}

type _EntityViewFieldReference<
	_Fields extends Record<string, _FacetFieldDefinition>,
	_SelectorsAndFacets extends _EntitySelectorsAndFacets<_Fields>,
> = (
	Extract<
		| keyof _Fields & string
		| (_SelectorsAndFacets extends {
			facets: infer _Facets extends Record<string, _EntityFacetDefinition>
		} ?
			string extends keyof _Facets ?
				never
			:
				{
					[_FacetName in keyof _Facets & string]: _FacetDefinitionFieldPath<
						_FacetName,
						_Facets[_FacetName]
					>
				}[keyof _Facets & string]
		:
			never),
		_FieldReference
	>
)

type _EntitySelectorFieldReference<
	_SelectorsAndFacets,
> = _SelectorsAndFacets extends {
	selectors: infer _Selectors extends Record<string, readonly string[]>
} ?
	_Selectors[keyof _Selectors][number]
:
	never

type _EntitySelectorsAndFacetsValidation<
	_Fields extends Record<string, _FacetFieldDefinition>,
	_SelectorsAndFacets extends _EntitySelectorsAndFacets<_Fields>,
> = {
	views?: {
		singular?: _EntityView<_EntityViewFieldReference<_Fields, _SelectorsAndFacets>>
		plural: _ListView<
			_EntityViewFieldReference<_Fields, _SelectorsAndFacets>,
			_EntitySelectorFieldReference<_SelectorsAndFacets>
		>
	}
} & (_SelectorsAndFacets extends {
	facets: infer _Facets extends Record<string, _EntityFacetDefinition>
} ?
	{
		facets: _Facets & _TitleCaseFacetDefinitions<_FacetDefinitionsWithoutFields<_Fields, _Facets>>
	}
	& (
		_FacetTreeIsValid<
			_NamedDefinitions<_Facets, 'name'>,
			keyof _Fields & string
		> extends true ?
			Record<never, never>
		:
			{
				readonly __invalidFacetDefinitions: never
			}
	)
:
	Record<never, never>)

type _NamedDefinitions<
	_Definitions extends Record<string, object>,
	_Identifier extends string,
> = {
	readonly [_Name in keyof _Definitions & string]: {
		readonly [_Key in _Identifier]: _Name
	} & _Definitions[_Name]
}[keyof _Definitions & string][]

function namedDefinitions<
	const _Definitions extends Record<string, object>,
	const _Identifier extends string,
>(
	definitions: _Definitions,
	identifier: _Identifier
): _NamedDefinitions<_Definitions, _Identifier>
function namedDefinitions(
	definitions: Record<string, object>,
	identifier: string
) {
	return Object.entries(definitions).map(([name, definition]) => ({
		[identifier]: name,
		...definition,
	}))
}

type _SelectorDefinitions<_Selectors extends Record<string, readonly string[]>> = {
	readonly [_Name in keyof _Selectors & string]: {
		readonly name: _Name
		readonly fields: _Selectors[_Name]
	}
}[keyof _Selectors & string][]

function selectorDefinitions<const _Selectors extends Record<string, readonly string[]>>(
	selectors: _Selectors
): _SelectorDefinitions<_Selectors>
function selectorDefinitions(selectors: Record<string, readonly string[]>) {
	return Object.entries(selectors).map(([name, fields]) => ({
		name,
		fields,
	}))
}

export const entity = <const _Meta extends _EntityMeta>(_meta: _Meta) => <
	const _Fields extends Record<string, _FacetFieldDefinition>,
>(_fields: _Fields & _FieldDefinitionsWithValidNames<_Fields>) => <
	const _SelectorsAndFacets extends _EntitySelectorsAndFacets<_Fields>,
>(
	_selectorsAndFacets: _SelectorsAndFacets & _EntitySelectorsAndFacetsValidation<_Fields, _SelectorsAndFacets>
) => ({
	..._meta,
	..._selectorsAndFacets,
	selectors: _selectorsAndFacets.selectors == null
		? []
		: selectorDefinitions(_selectorsAndFacets.selectors),
	fields: namedDefinitions(_fields, 'name'),
	facets: _selectorsAndFacets.facets == null
		? undefined
		: namedDefinitions(_selectorsAndFacets.facets, 'name'),
})

type _NamedFieldNames<_Fields extends readonly { name: string }[]> = _Fields[number]['name']

type _ConditionNamesAreValid<
	_Condition extends _AppFacetCondition,
	_AllowedNames extends string,
> = _Condition extends { path: readonly (infer _Part)[] }
	? Exclude<Extract<_Part, string>, _AllowedNames> extends never
		? true
		: false
	: _Condition extends { all: readonly (infer _Child)[] }
		? _AllTrue<{
			[_Index in keyof _Condition['all']]: _Condition['all'][_Index] extends _AppFacetCondition
				? _ConditionNamesAreValid<_Condition['all'][_Index], _AllowedNames>
				: false
		}>
		: false

type _AllTrue<_Values> = false extends Extract<_Values[keyof _Values], boolean> ? false : true

type _FacetTreeIsValid<
	_Facets extends readonly _EntityFacet[] | undefined,
	_AvailableFields extends string,
	_AncestorFacetNames extends string = never,
> = _Facets extends readonly _EntityFacet[]
	? Extract<_Facets[number]['name'], _AvailableFields> extends never
		? _AllTrue<{
		[_Index in keyof _Facets]: _Facets[_Index] extends infer _Facet extends _EntityFacet
			? _AllTrue<[
				_ConditionNamesAreValid<_Facet['condition'], _AvailableFields | _AncestorFacetNames>,
				_Facet['fields'] extends readonly _EntityField[]
					? _Facet['facets'] extends readonly _EntityFacet[]
						? Extract<
							_Facet['facets'][number]['name'],
							_AvailableFields | _NamedFieldNames<_Facet['fields']>
						> extends never
							? _FacetTreeIsValid<
								_Facet['facets'],
								_AvailableFields | _NamedFieldNames<_Facet['fields']>,
								_AncestorFacetNames | _Facet['name']
							>
							: false
						: true
					: true,
			]>
			: false
		}>
		: false
	: true

type _SelectorsAreValid<
	_Selectors extends readonly { fields: readonly string[] }[],
	_Fields extends readonly _EntityField[],
> = _AllTrue<{
	[_Index in keyof _Selectors]: Exclude<
		_Selectors[_Index]['fields'][number],
		_NamedFieldNames<_Fields>
	> extends never ?
		Extract<
			_Fields[number],
			{ name: _Selectors[_Index]['fields'][number] }
		>['cardinality'] extends EntityFieldCardinality.One ?
			true
		:
			false
	:
		false
}>

type _EntityDefinitionIsValid<_Entity extends {
	fields: readonly _EntityField[]
	selectors: readonly { fields: readonly string[] }[]
	facets?: readonly _EntityFacet[]
}> = _SelectorsAreValid<_Entity['selectors'], _Entity['fields']> extends true
	? _FacetTreeIsValid<_Entity['facets'], _NamedFieldNames<_Entity['fields']>>
	: false

type _AppDefinitionsAreValid<_App extends {
	schema: {
		entities: readonly object[]
	}
}> = _AllTrue<{
	[_Index in keyof _App['schema']['entities']]: _App['schema']['entities'][_Index] extends infer _Entity
		? _Entity extends {
				fields: readonly _EntityField[]
				selectors: readonly { fields: readonly string[] }[]
			}
			? _EntityDefinitionIsValid<_Entity>
			: false
		: false
}>

export const facet = <
	const _Condition extends _AppFacetCondition,
>(
	condition: _Condition
) => <
	const _Fields extends Record<string, _FacetFieldDefinition>,
>(
	fields: _Fields & _FieldDefinitionsWithValidNames<_Fields>
) => Object.assign(
	<const _Nested extends Record<string, _EntityFacetDefinition>>(
		nested: {
			facets?: _Nested & _TitleCaseFacetDefinitions<_FacetDefinitionsWithoutFields<_Fields, _Nested>>
			singularView?: _EntityFacet['singularView']
		}
	) => ({
		condition,
		fields: namedDefinitions(fields, 'name'),
		facets: nested.facets == null
			? undefined
			: namedDefinitions(nested.facets, 'name'),
		singularView: nested.singularView,
	}),
	{
		condition,
		fields: namedDefinitions(fields, 'name'),
	}
)

type _NavigationItem = {
	id: string
	title: string
	icon?: string
	address?: {
		network?: { chainId: number }
		address: `0x${string}`
	}
	href?: string
	tag?: string
	tagIcon?: string
	defaultIsOpen?: boolean
	manualWatch?: boolean
	children?: _NavigationItem[]
	allChildren?: _NavigationItem[]
}

type _RouteView = {
	entity?: string
	selector?: string
	component?: string
	Content?: _RawSnippet
	text?: string
	imports?: _Import[]
	script?: string
	style?: string
}

type _RoutePage = {
	view?: _RouteView
	text?: _Text
	placeholderText?: string
}

type _RouteLayout = {
	kind: 'group'
	title: string
	href?: string
}

type _SelectorRouteMapping = {
	children?: never
	collections?: never
	layout?: never
	selectors?: never
	projection?: {
		entityType: string
		facetPath: readonly [string, ...string[]]
	}
	when?: _AppFacetCondition
	params?: Readonly<Record<string, readonly [string, ...string[]]>>
	derivations?: Readonly<Record<string, _Expression>>
	title?: _Expression
	href?: {
		entityHref?: false
		canonicalize?: true
		conditions?: {
			field: string
			equals?: _Literal
			notEquals?: _Literal
			contains?: _Literal
		}[]
		params?: Readonly<Record<string, _Expression>>
	}
	probeCount?: number
	boundaryLiveOptional?: true
	page?: false | {
		view?: Omit<_RouteView, 'entity' | 'selector'>
		text?: _Text
	}
}

type _SelectorRouteVariant = {
	params?: Readonly<Record<string, readonly [string, ...string[]]>>
	derivations?: Readonly<Record<string, _Expression>>
	href?: {
		entityHref?: false
		canonicalize?: true
		conditions?: {
			field: string
			equals?: _Literal
			notEquals?: _Literal
			contains?: _Literal
		}[]
		params?: Readonly<Record<string, _Expression>>
	}
	boundaryLiveOptional?: true
	page?: _RoutePage
}

type _SchemaEntity<_Schema> = (
	_Schema extends {
		entities: readonly (infer _Entity)[]
	} ?
		_Entity
	:
		never
)

type _SchemaEntityType<_Schema> = Extract<
	_SchemaEntity<_Schema> extends {
		entityType: infer _EntityType
	} ?
		_EntityType
	:
		never,
	string
>

type _SchemaEntityByType<
	_Schema,
	_EntityType extends _SchemaEntityType<_Schema>,
> = Extract<_SchemaEntity<_Schema>, {
	entityType: _EntityType
}>

type _SchemaSelectorName<
	_Schema,
	_EntityType extends _SchemaEntityType<_Schema>,
> = Extract<
	_SchemaEntityByType<_Schema, _EntityType> extends {
		selectors: readonly (infer _Selector)[]
	} ?
		_Selector extends {
			name: infer _SelectorName
		} ?
			_SelectorName
		:
			never
	:
		never,
	string
>

type _SchemaSelectorFieldName<
	_Schema,
	_EntityType extends _SchemaEntityType<_Schema>,
	_SelectorName extends _SchemaSelectorName<_Schema, _EntityType>,
> = Extract<
	Extract<
		_SchemaEntityByType<_Schema, _EntityType> extends {
			selectors: readonly (infer _Selector)[]
		} ?
			_Selector
		:
			never,
		{
			name: _SelectorName
		}
	> extends {
		fields: readonly (infer _FieldName)[]
	} ?
		_FieldName
	:
		never,
	string
>

type _SchemaEntityFieldByName<
	_Schema,
	_EntityType extends _SchemaEntityType<_Schema>,
	_FieldName extends string,
> = Extract<
	_SchemaEntityByType<_Schema, _EntityType> extends {
		fields: readonly (infer _Field)[]
	} ?
		_Field
	:
		never,
	{
		name: _FieldName
	}
>

type _SchemaRouteParamFieldPathFromField<
	_Schema,
	_Field,
	_VisitedEntityTypes extends _SchemaEntityType<_Schema>,
> = (
	_Field extends {
		name: infer _FieldName extends string
		type: EntityFieldType.Primitive
		valueType: infer _ValueType
	} ?
		_ValueType extends _SchemaRouteParamValueTypeName<_Schema> ?
			readonly [_FieldName]
		:
			never
	: _Field extends {
		name: infer _FieldName extends string
		type: EntityFieldType.EntityReference
		entityType: infer _EntityType extends _SchemaEntityType<_Schema>
	} ?
		_EntityType extends _VisitedEntityTypes ?
			never
		:
			_SchemaEntityRouteParamFieldPath<
				_Schema,
				_EntityType,
				_VisitedEntityTypes | _EntityType
			> extends infer _NestedPath extends readonly [string, ...string[]] ?
				readonly [_FieldName, ..._NestedPath]
			:
				never
	:
		never
)

type _SchemaEntityRouteParamFieldPath<
	_Schema,
	_EntityType extends _SchemaEntityType<_Schema>,
	_VisitedEntityTypes extends _SchemaEntityType<_Schema>,
> = {
	[_FieldName in _SchemaSelectorFieldName<
		_Schema,
		_EntityType,
		_SchemaSelectorName<_Schema, _EntityType>
	>]: _SchemaRouteParamFieldPathFromField<
		_Schema,
		_SchemaEntityFieldByName<_Schema, _EntityType, _FieldName>,
		_VisitedEntityTypes
	>
}[_SchemaSelectorFieldName<
	_Schema,
	_EntityType,
	_SchemaSelectorName<_Schema, _EntityType>
>]

type _SchemaSelectorRouteParamFieldPath<
	_Schema,
	_EntityType extends _SchemaEntityType<_Schema>,
	_SelectorName extends _SchemaSelectorName<_Schema, _EntityType>,
> = {
	[_FieldName in _SchemaSelectorFieldName<
		_Schema,
		_EntityType,
		_SelectorName
	>]: _SchemaRouteParamFieldPathFromField<
		_Schema,
		_SchemaEntityFieldByName<_Schema, _EntityType, _FieldName>,
		_EntityType
	>
}[_SchemaSelectorFieldName<_Schema, _EntityType, _SelectorName>]

type _SchemaFacetPath<
	_Facets,
	_Prefix extends readonly string[] = [],
> = (
	_Facets extends readonly (infer _Facet)[] ?
		_Facet extends {
			name: infer _FacetName extends string
			facets?: infer _NestedFacets
		} ?
			| readonly [..._Prefix, _FacetName]
			| _SchemaFacetPath<_NestedFacets, readonly [..._Prefix, _FacetName]>
		:
			never
	:
		never
)

type _SchemaProjection<_Schema> = {
	[_EntityType in _SchemaEntityType<_Schema>]: (
		_SchemaEntityByType<_Schema, _EntityType> extends {
			facets?: infer _Facets
		} ?
			_SchemaFacetPath<_Facets> extends infer _FacetPath extends readonly [string, ...string[]] ?
				{
					entityType: _EntityType
					facetPath: _FacetPath
				}
			:
				never
		:
			never
	)
}[_SchemaEntityType<_Schema>]

type _SchemaPrimitiveConditionForField<
	_Field,
	_Prefix extends readonly (string | number)[],
> = _Field extends {
	name: infer _FieldName extends string
	type: EntityFieldType.Primitive
	cardinality: infer _Cardinality
} ? _Cardinality extends EntityFieldCardinality.Many | EntityFieldCardinality.ZeroOrMany ?
	| {
		path: readonly [..._Prefix, _FieldName]
		includes: _Literal
	}
	| {
		path: readonly [..._Prefix, _FieldName, number]
		is: _Literal
	}
	| {
		path: readonly [..._Prefix, _FieldName, number]
		isOneOf: readonly [_Literal, ..._Literal[]]
	}
:
	| {
		path: readonly [..._Prefix, _FieldName]
		is: _Literal
	}
	| {
		path: readonly [..._Prefix, _FieldName]
		isOneOf: readonly [_Literal, ..._Literal[]]
	}
:
	never

type _SchemaPrimitiveConditionForFields<
	_Fields,
	_Prefix extends readonly (string | number)[],
> = _Fields extends readonly (infer _Field)[] ?
	_SchemaPrimitiveConditionForField<_Field, _Prefix>
:
	never

type _SchemaPrimitiveConditionForFacets<
	_Facets,
	_Prefix extends readonly (string | number)[] = [],
> = _Facets extends readonly (infer _Facet)[] ? _Facet extends {
	name: infer _FacetName extends string
	fields?: infer _Fields
	facets?: infer _NestedFacets
} ?
	| _SchemaPrimitiveConditionForFields<_Fields, readonly [..._Prefix, _FacetName]>
	| _SchemaPrimitiveConditionForFacets<_NestedFacets, readonly [..._Prefix, _FacetName]>
:
	never
:
	never

type _SchemaEntityAtomicCondition<
	_Schema,
	_EntityType extends _SchemaEntityType<_Schema>,
> = _SchemaEntityByType<_Schema, _EntityType> extends {
	fields: infer _Fields
	facets?: infer _Facets
} ?
	| _SchemaPrimitiveConditionForFields<_Fields, []>
	| _SchemaPrimitiveConditionForFacets<_Facets>
:
	never

type _SchemaEntityCondition<
	_Schema,
	_EntityType extends _SchemaEntityType<_Schema>,
> =
	| _SchemaEntityAtomicCondition<_Schema, _EntityType>
	| {
		all: readonly [
			_SchemaEntityCondition<_Schema, _EntityType>,
			..._SchemaEntityCondition<_Schema, _EntityType>[],
		]
	}

type _SchemaRouteProjection<_Schema> = _SchemaProjection<_Schema> extends infer _Projection ?
	_Projection extends {
		entityType: infer _EntityType extends _SchemaEntityType<_Schema>
	} ? {
		projection: _Projection
		when?: _SchemaEntityCondition<_Schema, _EntityType>
	}
	:
	never
:
	never

type _SchemaFieldReference<
	_Schema,
	_EntityType extends _SchemaEntityType<_Schema>,
> = (
	_SchemaEntityByType<_Schema, _EntityType> extends {
		fields: readonly (infer _Field)[]
		facets?: infer _Facets
	} ?
		| Extract<_Field extends { name: infer _FieldName } ? _FieldName : never, string>
		| _FacetFieldPath<_Facets>
	:
		never
)

type _SchemaEntityFieldReference<_Schema> = {
	[_EntityType in _SchemaEntityType<_Schema>]: readonly [
		_EntityType,
		_SchemaFieldReference<_Schema, _EntityType>,
		...string[],
	]
}[_SchemaEntityType<_Schema>]

type _SelectorRouteMappingForSchema<
	_Schema,
	_EntityType extends _SchemaEntityType<_Schema>,
	_SelectorName extends _SchemaSelectorName<_Schema, _EntityType>,
> = Omit<_SelectorRouteMapping, 'projection' | 'when' | 'params' | 'derivations' | 'href'> & (
	| {
		projection?: never
		when?: _SchemaEntityCondition<_Schema, _EntityType>
	}
	| _SchemaRouteProjection<_Schema>
) & {
	params?: Readonly<Record<
		string,
		_SchemaSelectorRouteParamFieldPath<_Schema, _EntityType, _SelectorName>
	>>
	derivations?: Readonly<Partial<Record<
		_SchemaSelectorFieldName<_Schema, _EntityType, _SelectorName>,
		_Expression
	>>>
	href?: Omit<NonNullable<_SelectorRouteMapping['href']>, 'conditions'> & {
		conditions?: {
			field: _SchemaFieldReference<_Schema, _EntityType>
			equals?: _Literal
			contains?: _Literal
		}[]
	}
}

type _RouteNodeForSchema<
	_Schema,
> = Omit<_RouteNode, 'params' | 'collections' | 'selectors' | 'children'> & {
	params?: Readonly<Record<string, readonly [
		_SchemaRouteParamValueTypeName<_Schema>,
		..._SchemaRouteParamValueTypeName<_Schema>[],
	]>>
	collections?: readonly {
		field: _SchemaEntityFieldReference<_Schema>
		query?: _ViewQuery
		derivations?: Readonly<Record<string, _Expression>>
		page?: _RoutePage
	}[]
	selectors?: {
		readonly [_EntityType in _SchemaEntityType<_Schema>]?: {
			readonly [_SelectorName in _SchemaSelectorName<_Schema, _EntityType>]?: _SelectorRouteMappingForSchema<
				_Schema,
				_EntityType,
				_SelectorName
			>
		}
	}
	children?: Readonly<Record<string, _RouteNodeForSchema<_Schema>>>
}

type _RouteDefinitionsForSchema<_Schema> = Omit<_RouteDefinitions, 'children'> & {
	children: Readonly<Record<string, _RouteNodeForSchema<_Schema>>>
}

type _SchemaRouteParamValueTypeName<_Schema> = Extract<
	| (_Schema extends {
		valueTypes: readonly (infer _ValueType)[]
	} ?
		_ValueType extends {
			id: infer _ValueTypeName
			routeParam: {
				matcher: string
			}
		} ?
			_ValueTypeName
		:
		never
	:
		never
	)
	| (_Schema extends {
		entities: readonly (infer _Entity)[]
	} ?
		_Entity extends {
			enums: readonly (infer _Enum)[]
		} ?
			_Enum extends {
				name: infer _EnumName
				routeParam: {
					matcher: string
				}
			} ?
				_EnumName
			:
				never
		:
			never
	:
		never),
	string
>

type _RouteNode = {
	params?: Readonly<Record<string, readonly [string, ...string[]]>>
	selectorVariant?: _SelectorRouteVariant
	collections?: readonly {
		field: readonly [string, _FieldReference, ...string[]]
		query?: _ViewQuery
		derivations?: Readonly<Record<string, _Expression>>
		page?: _RoutePage
	}[]
	selectors?: Readonly<Record<string, Readonly<Record<string, _SelectorRouteMapping>>>>
	page?: _RoutePage
	layout?: _RouteLayout
	children?: Readonly<Record<string, _RouteNode>>
}

type _RouteDefinitions = {
	children: Readonly<Record<string, _RouteNode>>
}

export const defineRoutes = <const _Schema extends {
	valueTypes: readonly {
		id?: string
		routeParam?: _ValueTypeRouteParam
	}[]
	entities: readonly {
		entityType: string
		selectors: readonly {
			name: string
			fields: readonly string[]
		}[]
	}[]
}>(_schema: _Schema) => <
	const _Routes extends _RouteDefinitionsForSchema<_Schema>,
>(
	_routes: _Routes
) => _routes

export type App = {
	navigation: {
		items: _NavigationItem[]
	}
	schema: {
		valueTypes: readonly {
			id?: string
			name?: string
			displayImports?: readonly _Import[]
			routeParam?: _ValueTypeRouteParam
			type: _ValueTypeType
		}[]
		entities: readonly {
			entityType: string
			labels: {
				singular: string
				plural: string
			}
			icon?: string
			description?: string
			enums?: readonly _AppEnum[]
			selectors: readonly {
				name: string
				fields: readonly string[]
			}[]
			fields: readonly _EntityField[]
			facets?: readonly _EntityFacet[]
			views: {
				singular?: _EntityView
				plural: _ListView
			}
		}[]
	}
	routes: {
		children: _RouteDefinitions['children']
	}
	sources: {
		providers: readonly SourceProviderDefinition[]
		sources: readonly SourceDefinition[]
	},
	resolvers: {
		modules: {
			source: string
			path?: string
			paths?: readonly string[]
		}[]
	}
}
