<script module lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { SubscribeSelection } from '$/client/$client.svelte.ts'
	import { EntityProxyField } from '$/client/$proxy.svelte.ts'
	import type {
		EntityProxyData,
		EntityProxyFieldResource,
		EntityProxyResource,
	} from '$/client/$proxy.svelte.ts'
	import type {
		EntityFieldName,
		EntityMetaKey,
		EntitySelector,
	} from '$/schema/$schema.ts'
	import type { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'

	import type { EntityLayout } from '$/components/EntityView.svelte'

	export type EntityView2ValueContext<
		_EntityType extends EntityType,
	> = {
		entity: EntityProxyData<typeof schema, _EntityType>
		entitySelector: EntitySelector<typeof schema, _EntityType>
		open?: boolean
	}

	export type EntityView2FieldName<
		_EntityType extends EntityType,
	> = keyof EntityProxyData<typeof schema, _EntityType> & string

	export type EntityView2Value<
		_EntityType extends EntityType,
	> = {
		field?: EntityView2FieldName<_EntityType>
		text?: string
		Render?: Snippet<[context: EntityView2ValueContext<_EntityType>]>
	}

	export type EntityView2DetailItem<
		_EntityType extends EntityType,
	> = EntityView2Value<_EntityType> & {
		id: string
		label: string
		when?: 'always' | 'open'
	}

	export type EntityView2DetailList<
		_EntityType extends EntityType,
	> = {
		id: string
		items: readonly EntityView2DetailItem<_EntityType>[]
	}

	export type EntityView2Block<
		_EntityType extends EntityType,
	> = {
		id: string
		when?: 'always' | 'open'
		Content: Snippet<[context: EntityView2ValueContext<_EntityType>]>
	}

	export type EntityView2DetailsItem<
		_EntityType extends EntityType,
	> = {
		id: string
		label: string
		when?: 'always' | 'open'
		Content: Snippet<[context: EntityView2ValueContext<_EntityType>]>
	}

	export type EntityView2DetailsTab<
		_EntityType extends EntityType,
	> = EntityView2DetailsItem<_EntityType>

	export type EntityView2Content<
		_EntityType extends EntityType,
	> = {
		dl?: readonly EntityView2DetailList<_EntityType>[]
		blocks?: readonly EntityView2Block<_EntityType>[]
	}

	export type EntityView2Details<
		_EntityType extends EntityType,
	> = {
		label?: string
		items?: readonly EntityView2DetailsItem<_EntityType>[]
		tabs?: readonly EntityView2DetailsTab<_EntityType>[]
	}

	export type EntityView2DeclaredText = {
		label: string
		description?: string
		slot?: string
	}

	export type EntityView2DeclaredFieldFormat = (
		| 'auto'
		| 'code'
		| 'dateTime'
		| 'longText'
		| 'number'
		| 'numberValue'
		| 'percent'
		| 'timestamp'
		| 'url'
		| 'text'
		| 'truncated'
	)

	export type EntityView2DeclaredReferenceDisplay = (
		| 'selector'
		| 'selectorKey'
		| 'card'
		| 'list'
	)

	export type EntityView2DeclaredListDisplay = (
		| 'selectorKey'
		| 'selector'
		| 'codeList'
	)

	export type EntityView2DeclaredField<
		_EntityType extends EntityType,
	> = {
		field: EntityFieldName<typeof schema, _EntityType>
		label?: string
		description?: string
		format?: EntityView2DeclaredFieldFormat
		selection?: SubscribeSelection<typeof schema, _EntityType>
		referenceDisplay?: EntityView2DeclaredReferenceDisplay
		listDisplay?: EntityView2DeclaredListDisplay
		Render?: Snippet<[context: EntityView2ValueContext<_EntityType> & {
			fieldName: EntityFieldName<typeof schema, _EntityType>
			value: EntityProxyData<typeof schema, _EntityType>[EntityFieldName<typeof schema, _EntityType>]
		}]>
		Item?: Snippet<[context: {
			reference: {
				readonly [EntityMetaKey.Selector]: EntitySelector<typeof schema, EntityType>
				readonly [EntityMetaKey.SelectorKey]?: string
			}
		}]>
		prefix?: string
		suffix?: string
		when?: 'always' | 'closed' | 'open'
		ifPresent?: EntityFieldName<typeof schema, _EntityType>
		ifNonEmpty?: boolean
		emptyText?: string
	}

	export type EntityView2DeclaredBlock<
		_EntityType extends EntityType,
	> = {
		id: string
		label?: string
		description?: string
		when?: 'always' | 'closed' | 'open'
		Content: Snippet<[context: EntityView2ValueContext<_EntityType>]>
	}

	export type EntityView2DeclaredMetrics<
		_EntityType extends EntityType,
	> = {
		id: string
		label?: string
		description?: string
		when?: 'always' | 'closed' | 'open'
		metrics: readonly {
			field: EntityFieldName<typeof schema, _EntityType>
			label?: string
			selection?: SubscribeSelection<typeof schema, _EntityType>
		}[]
	}

	export type EntityView2SectionContext<
		_EntityType extends EntityType,
	> = EntityView2ValueContext<_EntityType> & {
		id: string
		label: string
		open?: boolean
	}

	export type EntityView2DeclaredItem<
		_EntityType extends EntityType,
	> = (
		| EntityFieldName<typeof schema, _EntityType>
		| EntityView2DeclaredText
		| EntityView2DeclaredField<_EntityType>
		| EntityView2DeclaredBlock<_EntityType>
		| EntityView2DeclaredMetrics<_EntityType>
	)

	export type EntityView2DeclaredSummary<
		_EntityType extends EntityType,
	> = {
		icon?: EntityView2DeclaredItem<_EntityType> | EntityView2DeclaredMedia<_EntityType>
		value?: EntityView2DeclaredItem<_EntityType> | readonly EntityView2DeclaredItem<_EntityType>[]
		title?: EntityView2DeclaredItem<_EntityType> | readonly EntityView2DeclaredItem<_EntityType>[]
		titleFallback?: readonly EntityView2DeclaredItem<_EntityType>[]
		after?: readonly EntityView2DeclaredItem<_EntityType>[]
	}

	export type EntityView2DeclaredRoute<
		_EntityType extends EntityType,
	> = {
		href?: string
		slot?: string
		kind?: 'browse' | 'dashboard' | 'landing' | 'route'
		component?: string
		children?: 'route' | 'sections' | 'tabs'
		selectorNormalization?: string
		dependsOn?: readonly EntityFieldName<typeof schema, _EntityType>[]
	}

	export type EntityView2DeclaredQuery<
		_EntityType extends EntityType,
	> = {
		sources?: readonly (keyof typeof Source)[]
		fields?: readonly EntityFieldName<typeof schema, _EntityType>[]
		openFields?: readonly EntityFieldName<typeof schema, _EntityType>[]
		facets?: readonly string[]
		openFacets?: readonly string[]
		limit?: number
		sort?: string
		order?: 'asc' | 'desc'
		defer?: 'open' | 'visible'
		refresh?: 'manual' | 'live' | 'staleWhileOpen'
		layoutFields?: readonly {
			layout: string
			fields: readonly EntityFieldName<typeof schema, _EntityType>[]
		}[]
		slot?: string
		policies?: readonly {
			when?: {
				hasSelectorFields?: readonly string[]
				selectorPath?: string
				equals?: string | number | boolean
			}
			sources?: readonly (keyof typeof Source)[]
			fields?: readonly EntityFieldName<typeof schema, _EntityType>[]
			openFields?: readonly EntityFieldName<typeof schema, _EntityType>[]
		}[]
	}

	export type EntityView2DeclaredMedia<
		_EntityType extends EntityType,
	> = {
		src?: EntityFieldName<typeof schema, _EntityType>
		image?: EntityFieldName<typeof schema, _EntityType>
		thumbnail?: EntityFieldName<typeof schema, _EntityType>
		title?: EntityFieldName<typeof schema, _EntityType>
		alt?: EntityFieldName<typeof schema, _EntityType>
		extension?: EntityFieldName<typeof schema, _EntityType>
		contentType?: EntityFieldName<typeof schema, _EntityType>
		contentSize?: EntityFieldName<typeof schema, _EntityType>
		displayType?: EntityFieldName<typeof schema, _EntityType>
		text?: EntityFieldName<typeof schema, _EntityType>
		preview?: 'audio' | 'file' | 'image' | 'text' | 'video'
		fallbackIcon?: string
		slot?: string
	}

	export type EntityView2DeclaredMetric<
		_EntityType extends EntityType,
	> = {
		field?: EntityFieldName<typeof schema, _EntityType>
		label?: string
		group?: string | EntityView2DeclaredText
		format?: EntityView2DeclaredFieldFormat | 'currency'
		currencyField?: EntityFieldName<typeof schema, _EntityType>
		fallbackField?: EntityFieldName<typeof schema, _EntityType>
		slot?: string
	}

	export type EntityView2DeclaredLatest<
		_EntityType extends EntityType,
	> = {
		field: EntityFieldName<typeof schema, _EntityType>
		sort?: 'timestampMs' | 'blockNumber' | 'slot' | 'height'
		direction?: 'asc' | 'desc'
		view?: string
		metric?: EntityView2DeclaredMetric<_EntityType>
		slot?: string
	}

	export type EntityView2DeclaredListSection<
		_EntityType extends EntityType,
	> = {
		id: string
		label: string
		field?: EntityFieldName<typeof schema, _EntityType>
		href?: string
		limit?: number
		sort?: string
		order?: 'asc' | 'desc'
		key?: string
		orientation?: 'column' | 'row' | 'carousel'
		placeholderKeys?: readonly string[]
		placeholderText?: string
		emptyText?: string
		item?: 'summary' | 'link' | 'custom'
		itemHref?: string
		collapsible?: boolean
		showSummary?: boolean
		query?: EntityView2DeclaredQuery<_EntityType>
		parentField?: string
		Item?: string
		Empty?: string
		slot?: string
	}

	export type EntityView2DeclaredDisplay<
		_EntityType extends EntityType,
	> = {
		field?: EntityFieldName<typeof schema, _EntityType>
		kind: 'address' | 'amount' | 'boolean' | 'code' | 'copyable' | 'duration' | 'externalLink' | 'htmlText' | 'json' | 'markdown' | 'number' | 'percent' | 'timestamp' | 'truncated' | 'url'
		format?: string
		unit?: string
		scale?: string
		precision?: number
		slot?: string
	}

	export type EntityView2DeclaredCondition<
		_EntityType extends EntityType,
	> = {
		field?: EntityFieldName<typeof schema, _EntityType>
		operator?: 'exists' | 'nonEmpty' | 'equals' | 'notEquals' | 'truthy'
		value?: string | number | boolean
		slot?: string
	}

	export type EntityView2DeclaredPanel<
		_EntityType extends EntityType,
	> = {
		id: string
		label: string
		kind?: 'chart' | 'decode' | 'details' | 'form' | 'media' | 'metricRows' | 'raw' | 'tabs' | 'timeline' | 'transform' | 'tree'
		items?: readonly EntityView2DeclaredItem<_EntityType>[]
		when?: EntityView2DeclaredCondition<_EntityType>
		defer?: 'open' | 'visible'
		slot?: string
	}

	export type EntityView2DeclaredAction<
		_EntityType extends EntityType,
	> = {
		id: string
		label: string
		kind: 'copy' | 'createLocal' | 'deleteLocal' | 'download' | 'externalLink' | 'navigate' | 'reveal' | 'share'
		field?: EntityFieldName<typeof schema, _EntityType>
		href?: string
		slot?: string
	}

	export type EntityView2DeclaredDecode<
		_EntityType extends EntityType,
	> = {
		field?: EntityFieldName<typeof schema, _EntityType>
		kind: 'abi' | 'bytecode' | 'calldata' | 'eventLog' | 'json' | 'rawBytes' | 'trace' | 'transactionInput'
		slot?: string
	}

	export type EntityView2DeclaredChart<
		_EntityType extends EntityType,
	> = {
		id: string
		label: string
		kind: 'line' | 'ohlc' | 'rows' | 'timeseries'
		x?: EntityFieldName<typeof schema, _EntityType>
		y?: EntityFieldName<typeof schema, _EntityType>
		controls?: {
			lookbackDays?: readonly number[]
			intervals?: readonly string[]
		}
		slot?: string
	}

	export type EntityView2DeclaredForm = {
		id: string
		label: string
		kind: 'createLocal' | 'deleteLocal' | 'filter' | 'search'
		fields?: readonly {
			name: string
			label: string
			kind?: 'select' | 'text' | 'textarea' | 'toggle'
		}[]
		slot?: string
	}

	export type EntityView2DeclaredTransform<
		_EntityType extends EntityType,
	> = {
		id: string
		label: string
		field?: EntityFieldName<typeof schema, _EntityType>
		kind: 'addressEncoding' | 'alternateEncodings' | 'baseEncoding' | 'hash' | 'selectorEncoding'
		slot?: string
	}

	export type EntityView2DeclaredTooltip = {
		id: string
		label?: string
		description?: string
		slot?: string
	}

	export type EntityView2DeclaredSlot = {
		slot: string
		label: string
		description?: string
		for?: 'Icon' | 'Value' | 'Title' | 'Content' | 'Details' | 'Item' | 'List' | 'Section'
	}

	export type EntityView2DeclaredRenderer = {
		slot: string
		component: string
		label: string
		for?: 'action' | 'chart' | 'decode' | 'form' | 'list' | 'media' | 'metricRows' | 'summary' | 'transform' | 'value'
		description?: string
	}

	export type EntityView2DeclaredDispatch<
		_EntityType extends EntityType,
	> = {
		id: string
		label: string
		sourceField?: EntityFieldName<typeof schema, _EntityType>
		slot?: string
		cases: readonly {
			when: string
			entityType: EntityType
			selector: string
			component?: string
		}[]
	}

	export type EntityView2DeclaredView<
		_EntityType extends EntityType,
	> = {
		layout?: keyof typeof EntityLayout
		defaultOpen?: boolean
		route?: EntityView2DeclaredRoute<_EntityType>
		query?: EntityView2DeclaredQuery<_EntityType>
		media?: EntityView2DeclaredMedia<_EntityType>
		metrics?: readonly EntityView2DeclaredMetric<_EntityType>[]
		latest?: readonly EntityView2DeclaredLatest<_EntityType>[]
		lists?: readonly EntityView2DeclaredListSection<_EntityType>[]
		display?: readonly EntityView2DeclaredDisplay<_EntityType>[]
		conditions?: readonly EntityView2DeclaredCondition<_EntityType>[]
		panels?: readonly EntityView2DeclaredPanel<_EntityType>[]
		actions?: readonly EntityView2DeclaredAction<_EntityType>[]
		decodes?: readonly EntityView2DeclaredDecode<_EntityType>[]
		charts?: readonly EntityView2DeclaredChart<_EntityType>[]
		forms?: readonly EntityView2DeclaredForm[]
		transforms?: readonly EntityView2DeclaredTransform<_EntityType>[]
		tooltips?: readonly EntityView2DeclaredTooltip[]
		slots?: readonly EntityView2DeclaredSlot[]
		renderers?: readonly EntityView2DeclaredRenderer[]
		dispatch?: readonly EntityView2DeclaredDispatch<_EntityType>[]
		summary?: EntityView2DeclaredSummary<_EntityType>
		closed?: readonly EntityView2DeclaredItem<_EntityType>[]
		content?: {
			dl?: readonly (readonly EntityView2DeclaredItem<_EntityType>[])[]
			blocks?: readonly (readonly EntityView2DeclaredItem<_EntityType>[])[]
		}
		details?: {
			items?: readonly {
				label: string
				description?: string
				items: readonly EntityView2DeclaredItem<_EntityType>[]
			}[]
			tabs?: readonly {
				id?: string
				label: string
				description?: string
				items?: readonly EntityView2DeclaredItem<_EntityType>[]
				when?: 'always' | 'closed' | 'open'
				Content?: Snippet<[context: EntityView2ValueContext<_EntityType>]>
			}[]
			carousels?: readonly {
				id?: string
				label: string
				description?: string
				when?: 'always' | 'closed' | 'open'
				sections: readonly {
					id: string
					label: string
					description?: string
					when?: 'always' | 'closed' | 'open'
					field?: EntityFieldName<typeof schema, _EntityType>
					selection?: SubscribeSelection<typeof schema, _EntityType>
					ifNonEmpty?: boolean
					items?: readonly EntityView2DeclaredItem<_EntityType>[]
					List?: Snippet<[context: {
						id: string
						label: string
						open?: boolean
						selection: EntityProxyFieldResource<
							typeof schema,
							_EntityType,
							EntityFieldName<typeof schema, _EntityType>
						>
					}]>
					Content?: Snippet<[context: EntityView2SectionContext<_EntityType>]>
				}[]
			}[]
		}
	}
</script>


<script
	lang="ts"
	generics="
		_EntityType extends EntityType
	"
>
	// Types/constants
	import type { SubscribeSelection } from '$/client/$client.svelte.ts'
	import {
		EntityFieldType,
		EntityMetaKey,
		type EntityFieldDefinition,
	} from '$/schema/$schema.ts'
	import { entityDefinitionByType } from '$/schema/index.ts'


	// State
	let {
		selection,
		entityType,
		entitySelector = selection.entitySelector,
		selectionOptions,

		title,
		href,
		idDragPlainText,
		layout,
		collapsible,
		showTypeAnnotation,
		open = $bindable(true),
		placeholderText,

		view,
		closed = [],
		content,
		details,

		Icon,
		Value: ValueSnippet,
		ValueContent,
		Title: TitleSnippet,
		TitleContent,
		HeadingAfter: HeadingAfterSnippet,
		HeadingAfterContent,
		TypeAnnotationTooltip,
		Content: ContentSnippet,
		ContentAfter,
		CollapsibleProps,
		Details: DetailsSnippet,
	}: {
		selection: EntityProxyResource<typeof schema, _EntityType>
		entityType: _EntityType
		entitySelector?: EntitySelector<typeof schema, _EntityType>
		selectionOptions?: SubscribeSelection<typeof schema, _EntityType>

		title?: string
		href?: string
		idDragPlainText?: string
		layout?: EntityLayout
		collapsible?: boolean
		showTypeAnnotation?: boolean
		open?: boolean
		placeholderText?: string

		view?: EntityView2DeclaredView<_EntityType>
		closed?: readonly EntityView2Value<_EntityType>[]
		content?: EntityView2Content<_EntityType>
		details?: EntityView2Details<_EntityType>

		Icon?: Snippet
		Value?: Snippet
		ValueContent?: Snippet<[context: EntityView2ValueContext<_EntityType>]>
		Title?: Snippet
		TitleContent?: Snippet<[context: EntityView2ValueContext<_EntityType>]>
		HeadingAfter?: Snippet
		HeadingAfterContent?: Snippet<[context: EntityView2ValueContext<_EntityType>]>
		TypeAnnotationTooltip?: Snippet
		Content?: Snippet<[context: {
			title?: string
			href?: string
			open?: boolean
		}]>
		ContentAfter?: Snippet<[context: EntityView2ValueContext<_EntityType>]>
		CollapsibleProps?: ComponentProps<typeof EntityView>['CollapsibleProps']
		Details?: Snippet<[context: {
			open?: boolean
		}]>
	} = $props()

	const declaredClosed = $derived(view?.closed ?? [])
	const declaredMetrics = $derived(view?.metrics ?? [])
	const declaredLists = $derived(view?.lists ?? [])
	const declaredSummaryValue = $derived(view?.summary?.value)
	const declaredSummaryTitle = $derived(view?.summary?.title)
	const declaredSummaryAfter = $derived(view?.summary?.after ?? [])
	const declaredMedia = $derived(view?.media)
	const declaredContentDl = $derived(view?.content?.dl ?? [])
	const declaredContentBlocks = $derived(view?.content?.blocks ?? [])
	const declaredPanels = $derived(view?.panels ?? [])
	const declaredRenderers = $derived(view?.renderers ?? [])
	const declaredTransforms = $derived(view?.transforms ?? [])
	const declaredDetailTabs = $derived(view?.details?.tabs ?? [])
	const declaredDetailCarousels = $derived(view?.details?.carousels ?? [])
	const declaredDetailItems = $derived(view?.details?.items ?? [])
	const detailTabs = $derived(details?.tabs ?? [])
	const detailItems = $derived(details?.items ?? [])
	const declaredSelectionItems = $derived([
		...declaredClosed,
		...(
			declaredSummaryValue === undefined ?
				[]
			: typeof declaredSummaryValue === 'string' || !Array.isArray(declaredSummaryValue) ?
				[declaredSummaryValue]
			:
				declaredSummaryValue
		),
		...(
			declaredSummaryTitle === undefined ?
				[]
			: typeof declaredSummaryTitle === 'string' || !Array.isArray(declaredSummaryTitle) ?
				[declaredSummaryTitle]
			:
				declaredSummaryTitle
		),
		...declaredSummaryAfter,
		...declaredMetrics.flatMap((metric) => (
			metric.field === undefined ?
				[]
			:
				[metric.field]
		)),
		...(declaredMedia?.src === undefined ? [] : [declaredMedia.src]),
		...(declaredMedia?.image === undefined ? [] : [declaredMedia.image]),
		...(declaredMedia?.thumbnail === undefined ? [] : [declaredMedia.thumbnail]),
		...(declaredMedia?.title === undefined ? [] : [declaredMedia.title]),
		...(declaredMedia?.alt === undefined ? [] : [declaredMedia.alt]),
		...(declaredMedia?.extension === undefined ? [] : [declaredMedia.extension]),
		...(declaredMedia?.contentType === undefined ? [] : [declaredMedia.contentType]),
		...(declaredMedia?.contentSize === undefined ? [] : [declaredMedia.contentSize]),
		...(declaredMedia?.displayType === undefined ? [] : [declaredMedia.displayType]),
		...(declaredMedia?.text === undefined ? [] : [declaredMedia.text]),
		...(
			open ?
				[
					...declaredContentDl.flat(),
					...declaredContentBlocks.flat(),
		...declaredDetailTabs.flatMap((tab) => (
			tab.when === 'open' && open !== true ?
				[]
			:
				tab.items ?? []
		)),
					...declaredDetailCarousels.flatMap((carousel) => (
						carousel.sections.flatMap((section) => section.items ?? [])
					)),
					...declaredDetailItems.flatMap((item) => item.items),
				]
			:
				[]
		),
	])
	const declaredQueryFields = $derived([
		...(view?.query?.fields ?? []),
		...(open ? view?.query?.openFields ?? [] : []),
	])
	const declaredQueryPolicies = $derived(
		(view?.query?.policies ?? []).filter((policy) => (
			policy.when === undefined
			|| (
				(
					policy.when.hasSelectorFields === undefined
					|| policy.when.hasSelectorFields.every((field) => field in entitySelector)
				)
				&& (
					policy.when.selectorPath === undefined
					|| policy.when.equals === undefined
					|| stringify(entitySelector).includes(`${policy.when.selectorPath}:${policy.when.equals}`)
					|| stringify(entitySelector).includes(`${policy.when.selectorPath}:"${policy.when.equals}"`)
				)
			)
		))
	)
	const declaredQuerySources = $derived([
		...(view?.query?.sources ?? []),
		...declaredQueryPolicies.flatMap((policy) => policy.sources ?? []),
	])
	const declaredSelectionFieldEntries = $derived([
		...declaredQueryFields.map((field) => [
			field,
			true,
		]),
		...declaredQueryPolicies.flatMap((policy) => [
			...(policy.fields ?? []),
			...(open ? policy.openFields ?? [] : []),
		]).map((field) => [
			field,
			true,
		]),
		...declaredSelectionItems.flatMap((item) => {
			if (typeof item === 'string')
				return [[item, true]]

			if (Object.hasOwn(
				item,
				'field',
			))
				return [
					[item.field, item.selection ?? true],
					...(
						item.ifPresent === undefined ?
							[]
						:
							[[item.ifPresent, true]]
					),
				]

			if (Object.hasOwn(
				item,
				'metrics',
			))
				return item.metrics.map((metric) => [
					metric.field,
					metric.selection ?? true,
				])

			return []
		}),
		...declaredMetrics.flatMap((metric) => (
			metric.field === undefined ?
				[]
			:
				[[
					metric.field,
					true,
				]]
		)),
		...(
			open ?
				declaredDetailCarousels.flatMap((carousel) => (
					carousel.sections.flatMap((section) => (
						section.field === undefined ?
							[]
						:
							[[
								section.field,
								section.selection ?? true,
							]]
					))
				))
			:
				[]
		),
	])
	const declaredFieldSelectionOptions = $derived(
		selectionOptions ?? (
			declaredSelectionFieldEntries.length > 0 ?
				{
					...(declaredQuerySources.length > 0 && {
						sources: [...new Set(declaredQuerySources)].map((source) => Source[source]),
					}),
					fields: Object.fromEntries(declaredSelectionFieldEntries),
				}
			:
				undefined
		)
	)
	const entity = $derived(selection(declaredFieldSelectionOptions))
	const fieldDefinitionByName = $derived(
		Object.fromEntries(entityDefinitionByType[entityType].fields.map((fieldDefinition) => [
			fieldDefinition.name,
			fieldDefinition,
		]))
	)
	const entityDescription = $derived(entityDefinitionByType[entityType].description)
	const hasContent = $derived(
		ContentSnippet !== undefined
		|| closed.length > 0
		|| declaredClosed.length > 1
		|| declaredMetrics.length > 0
		|| declaredLists.length > 0
		|| declaredContentDl.length > 0
		|| declaredContentBlocks.length > 0
		|| (content?.dl?.length ?? 0) > 0
		|| (content?.blocks?.length ?? 0) > 0
	)
	const hasDetails = $derived(
		DetailsSnippet !== undefined
		|| declaredPanels.length > 0
		|| detailTabs.length > 0
		|| detailItems.length > 0
		|| declaredLists.length > 0
		|| declaredDetailTabs.length > 0
		|| declaredDetailCarousels.length > 0
		|| declaredDetailItems.length > 0
	)
	const hasHeadingAfter = $derived(
		HeadingAfterContent !== undefined
		|| HeadingAfterSnippet !== undefined
		|| declaredSummaryAfter.length > 0
	)


	// Functions
	import { stringify } from 'devalue'

	const shouldShow = (
		when: 'always' | 'closed' | 'open' | undefined,
		contentOpen: boolean | undefined,
	) => (
		when === undefined
		|| typeof when !== 'string'
		|| when === 'always'
		|| (when === 'open' && contentOpen === true)
		|| (when === 'closed' && contentOpen !== true)
	)

	const declaredItemField = (
		item: EntityView2DeclaredItem<_EntityType>,
	): EntityView2FieldName<_EntityType> | undefined => (
		typeof item === 'string' ?
			item
		: Object.hasOwn(
			item,
			'field',
		) ?
			item.field
	:
			undefined
	)

	const declaredItemBlock = (
		item: EntityView2DeclaredItem<_EntityType>,
	): EntityView2DeclaredBlock<_EntityType> | undefined => (
		typeof item !== 'string' && Object.hasOwn(
			item,
			'Content',
		) ?
			item
		:
			undefined
	)

	const declaredItemMetrics = (
		item: EntityView2DeclaredItem<_EntityType>,
	): EntityView2DeclaredMetrics<_EntityType> | undefined => (
		typeof item !== 'string' && Object.hasOwn(
			item,
			'metrics',
		) ?
			item
		:
			undefined
	)

	const declaredItemLabel = (
		item: EntityView2DeclaredItem<_EntityType>,
	) => (
		typeof item === 'string' ?
			fieldDefinitionByName[item]?.label ?? item
		: Object.hasOwn(
			item,
			'field',
		) ?
			item.label ?? fieldDefinitionByName[item.field]?.label ?? item.field
		:
			item.label
	)

	const declaredItemTextPrefix = (
		item: EntityView2DeclaredItem<_EntityType>,
	) => (
		typeof item !== 'string' && Object.hasOwn(
			item,
			'prefix',
		) ?
			item.prefix ?? ''
		:
			''
	)

	const declaredItemTextSuffix = (
		item: EntityView2DeclaredItem<_EntityType>,
	) => (
		typeof item !== 'string' && Object.hasOwn(
			item,
			'suffix',
		) ?
			item.suffix ?? ''
		:
			''
	)

	const declaredItemDescription = (
		item: EntityView2DeclaredItem<_EntityType>,
	) => (
		typeof item === 'string' ?
			fieldDefinitionByName[item]?.description
		: Object.hasOwn(
			item,
			'field',
		) ?
			item.description ?? fieldDefinitionByName[item.field]?.description
		:
			item.description
	)

	const declaredItemFieldDefinition = (
		item: EntityView2DeclaredItem<_EntityType>,
	): EntityFieldDefinition | undefined => (
		declaredItemField(item) === undefined ?
			undefined
		:
			fieldDefinitionByName[declaredItemField(item)]
	)

	const declaredItemIsPresent = (
		item: EntityView2DeclaredItem<_EntityType>,
	) => (
		declaredItemField(item) === undefined
		|| (
			entity[declaredItemField(item)] !== undefined
			&& entity[declaredItemField(item)] !== null
		)
	)

	const declaredItemShouldShow = (
		item: EntityView2DeclaredItem<_EntityType>,
		contentOpen: boolean | undefined,
	) => (
		(
			typeof item === 'string'
			|| !Object.hasOwn(
				item,
				'when',
			)
			|| shouldShow(
				item.when,
				contentOpen,
			)
		)
		&& (
			typeof item === 'string'
			|| !Object.hasOwn(
				item,
				'ifPresent',
			)
			|| item.ifPresent === undefined
			|| (
				entity[item.ifPresent] !== undefined
				&& entity[item.ifPresent] !== null
			)
		)
		&& (
			typeof item === 'string'
			|| !Object.hasOwn(
				item,
				'ifNonEmpty',
			)
			|| item.ifNonEmpty !== true
			|| declaredItemField(item) === undefined
			|| (entity[declaredItemField(item)]?.values?.length ?? 0) > 0
		)
	)

	const declaredSectionShouldShow = (
		section: {
			field?: EntityFieldName<typeof schema, _EntityType>
			ifNonEmpty?: boolean
			when?: 'always' | 'closed' | 'open'
		},
		contentOpen: boolean | undefined,
	) => (
		shouldShow(
			section.when,
			contentOpen,
		)
		&& (
			section.ifNonEmpty !== true
			|| section.field === undefined
			|| (entity[section.field]?.values?.length ?? 0) > 0
		)
	)

	const declaredConditionShouldShow = (
		condition: EntityView2DeclaredCondition<_EntityType> | undefined,
	) => (
		condition === undefined
		|| condition.field === undefined
		|| (
			condition.operator === 'equals' ?
				entity[condition.field] === condition.value
			: condition.operator === 'notEquals' ?
				entity[condition.field] !== condition.value
			: condition.operator === 'nonEmpty' ?
				String(entity[condition.field] ?? '') !== ''
			: condition.operator === 'truthy' ?
				Boolean(entity[condition.field])
			:
				entity[condition.field] !== undefined && entity[condition.field] !== null
		)
	)

	const declaredSectionId = (
		carousel: {
			id?: string
			label: string
		},
		section: {
			id: string
		},
	) => (
		`${stringify(entitySelector)}:${carousel.id ?? carousel.label}:${section.id}`
	)

	const declaredRenderer = (
		slot: string | undefined,
		rendererFor: EntityView2DeclaredRenderer['for'],
	) => (
		slot === undefined ?
			undefined
		:
			declaredRenderers.find((renderer) => (
				renderer.slot === slot
				&& (
					rendererFor === undefined
					|| renderer.for === undefined
					|| renderer.for === rendererFor
				)
			))
	)

	const declaredPanelTransform = (
		panel: EntityView2DeclaredPanel<_EntityType>,
	) => (
		declaredTransforms.find((transform) => transform.slot === panel.slot)
	)

	const firstPresentDeclaredItem = (
		itemOrItems: EntityView2DeclaredItem<_EntityType> | readonly EntityView2DeclaredItem<_EntityType>[] | undefined,
	) => (
		(
			itemOrItems === undefined ?
				[]
			: typeof itemOrItems === 'string' || !Array.isArray(itemOrItems) ?
				[itemOrItems]
			:
				itemOrItems
		).find(declaredItemIsPresent)
	)

	const declaredItemFormat = (
		item: EntityView2DeclaredItem<_EntityType>,
		fieldName: EntityView2FieldName<_EntityType>,
	) => (
		typeof item !== 'string' && Object.hasOwn(
			item,
			'format',
		) && item.format !== undefined ?
			item.format
		: fieldName.endsWith('TimestampMs') || fieldName.endsWith('AtMs') || fieldName === 'timestampMs' ?
			'dateTime'
		: fieldName.endsWith('Url') || fieldName.endsWith('Uri') || fieldName.endsWith('URI') ?
			'url'
		: fieldName.endsWith('Count') ?
			'number'
		: fieldName.endsWith('Percent') || fieldName.endsWith('Percentage') ?
			'percent'
		: fieldName.endsWith('Hash') || fieldName.endsWith('Hex') || fieldName.endsWith('Address') || fieldName === 'hash' || fieldName === 'hex' ?
			'truncated'
		:
			'auto'
	)

	const declaredReferenceText = (
		value: {
			readonly [EntityMetaKey.Selector]: EntitySelector<typeof schema, EntityType>
			readonly [EntityMetaKey.SelectorKey]?: string
		},
		referenceDisplay: EntityView2DeclaredReferenceDisplay | undefined,
	) => (
		referenceDisplay === 'selector' ?
			stringify(value[EntityMetaKey.Selector])
		:
			value[EntityMetaKey.SelectorKey] ?? stringify(value[EntityMetaKey.Selector])
	)

	const declaredItemEmptyText = (
		item: EntityView2DeclaredItem<_EntityType>,
		fieldDefinition: EntityFieldDefinition,
		fieldName: EntityView2FieldName<_EntityType>,
	) => (
		typeof item !== 'string' && Object.hasOwn(
			item,
			'emptyText',
		) && item.emptyText !== undefined ?
			item.emptyText
		:
			`No ${fieldDefinition.labelPlural ?? fieldDefinition.label ?? fieldName}`
	)

	const declaredItemListDisplay = (
		item: EntityView2DeclaredItem<_EntityType>,
	) => (
		typeof item !== 'string' && Object.hasOwn(
			item,
			'listDisplay',
		) && item.listDisplay !== undefined ?
			item.listDisplay
		:
			'codeList'
	)

	const declaredItemKey = (
		item: EntityView2DeclaredItem<_EntityType>,
	) => (
		typeof item === 'string' ?
			item
		: Object.hasOwn(
			item,
			'field',
		) ?
			`field:${item.field}`
		: Object.hasOwn(
			item,
			'id',
		) ?
			`id:${item.id}`
		: Object.hasOwn(
			item,
			'metrics',
		) ?
			`metrics:${item.label}`
	:
			`label:${item.label}`
	)

	const formatDateTime = (
		value: string | number | bigint | boolean,
	) => new Date(Number(value)).toLocaleString()

	const formatNumber = (
		value: string | number | bigint | boolean,
	) => new Intl.NumberFormat().format(Number(value))

	const formatValue = (
		value: string | number | bigint | boolean | object,
	) => {
		try {
			return (
				typeof value === 'function' ?
					''
				: Object(value) === value ?
					stringify(value)
				:
					String(value)
			)
		} catch {
			return ''
		}
	}

	const formatPercent = (
		value: string | number | bigint | boolean,
	) => new Intl.NumberFormat(undefined, {
		maximumFractionDigits: 4,
		style: 'percent',
	}).format(Number(value))


	// Components
	import EntityView from '$/components/EntityView.svelte'
	import CollapsibleTabs1 from '$/components/CollapsibleTabs1.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import NumberValue from '$/components/NumberValue.svelte'
	import SocialMetricSnapshotRows from '$/components/SocialMetricSnapshotRows.svelte'
	import FileDetails from '$/components/FileDetails.svelte'
	import IpfsCidAlternateEncodings from '$/views/IpfsCidAlternateEncodings.svelte'
	import SwarmBrowseForm from '$/views/SwarmBrowseForm.svelte'
</script>


{#snippet DeclaredItemValue(item: EntityView2DeclaredItem<_EntityType>)}
	{@const fieldName = declaredItemField(item)}
	{@const fieldDefinition = declaredItemFieldDefinition(item)}
	{@const block = declaredItemBlock(item)}
	{@const metrics = declaredItemMetrics(item)}
	{#if block !== undefined}
		{@render block.Content({
			entity,
			entitySelector,
			open,
		})}
	{:else if metrics !== undefined}
		<dl data-column-item="center">
			<SocialMetricSnapshotRows
				metrics={metrics.metrics.map((metric) => ({
					label: metric.label ?? fieldDefinitionByName[metric.field]?.label ?? metric.field,
					value: entity[metric.field] === undefined || entity[metric.field] === null ?
						undefined
					:
						Number(entity[metric.field]),
				}))}
			/>
		</dl>
	{:else if typeof item !== 'string' && fieldName === undefined}
		{#if item.description !== undefined}
			{item.description}
		{:else}
			{item.label}
		{/if}
	{:else if fieldName !== undefined && fieldDefinition !== undefined && entity[fieldName] !== undefined && entity[fieldName] !== null}
		{#if typeof item !== 'string' && Object.hasOwn(
			item,
			'Render',
		) && item.Render !== undefined}
			{@render item.Render({
				entity,
				entitySelector,
				fieldName,
				open,
				value: entity[fieldName],
			})}
		{:else if fieldDefinition.type === EntityFieldType.EntityReference}
			{declaredItemTextPrefix(item)}<code>{declaredReferenceText(
				entity[fieldName],
				typeof item !== 'string' && Object.hasOwn(
					item,
					'referenceDisplay',
				) ? item.referenceDisplay : undefined,
			)}</code>{declaredItemTextSuffix(item)}
		{:else if fieldDefinition.type === EntityFieldType.EntitiesReference}
			{#if entity[fieldName].values?.length > 0}
				{#if typeof item !== 'string' && Object.hasOwn(
					item,
					'Item',
				) && item.Item !== undefined}
					<ul>
						{#each entity[fieldName].values as reference (reference[EntityMetaKey.SelectorKey] ?? stringify(reference[EntityMetaKey.Selector]))}
							<li>
								{@render item.Item({
									reference,
								})}
							</li>
						{/each}
					</ul>
				{:else if declaredItemListDisplay(item) === 'selectorKey' || declaredItemListDisplay(item) === 'selector'}
					{entity[fieldName].values.map((reference) => declaredReferenceText(
						reference,
						declaredItemListDisplay(item) === 'selector' ?
							'selector'
						:
							'selectorKey',
					)).join(', ')}
				{:else}
					<ul>
						{#each entity[fieldName].values as reference (reference[EntityMetaKey.SelectorKey] ?? stringify(reference[EntityMetaKey.Selector]))}
							<li>
								<code>{declaredReferenceText(
									reference,
									typeof item !== 'string' && Object.hasOwn(
										item,
										'referenceDisplay',
									) ? item.referenceDisplay : undefined,
								)}</code>
							</li>
						{/each}
					</ul>
				{/if}
			{:else}
				<span data-text="muted">{declaredItemEmptyText(
					item,
					fieldDefinition,
					fieldName,
				)}</span>
			{/if}
		{:else if declaredItemFormat(
			item,
			fieldName,
		) === 'timestamp'}
			{declaredItemTextPrefix(item)}<Timestamp timestamp={Number(entity[fieldName])} />{declaredItemTextSuffix(item)}
		{:else if declaredItemFormat(
			item,
			fieldName,
		) === 'dateTime'}
			{declaredItemTextPrefix(item)}<time datetime={new Date(Number(entity[fieldName])).toISOString()}>{formatDateTime(entity[fieldName])}</time>{declaredItemTextSuffix(item)}
		{:else if declaredItemFormat(
			item,
			fieldName,
		) === 'numberValue'}
			{declaredItemTextPrefix(item)}<NumberValue value={Number(entity[fieldName])} />{declaredItemTextSuffix(item)}
		{:else if declaredItemFormat(
			item,
			fieldName,
		) === 'number'}
			{declaredItemTextPrefix(item)}{formatNumber(entity[fieldName])}{declaredItemTextSuffix(item)}
		{:else if declaredItemFormat(
			item,
			fieldName,
		) === 'percent'}
			{declaredItemTextPrefix(item)}{formatPercent(entity[fieldName])}{declaredItemTextSuffix(item)}
		{:else if declaredItemFormat(
			item,
			fieldName,
		) === 'url'}
			{declaredItemTextPrefix(item)}<code>{formatValue(entity[fieldName])}</code>{declaredItemTextSuffix(item)}
		{:else if declaredItemFormat(
			item,
			fieldName,
		) === 'code'}
			{declaredItemTextPrefix(item)}<code>{formatValue(entity[fieldName])}</code>{declaredItemTextSuffix(item)}
		{:else if declaredItemFormat(
			item,
			fieldName,
		) === 'longText'}
			{declaredItemTextPrefix(item)}<p><TruncatedValue value={formatValue(entity[fieldName])} /></p>{declaredItemTextSuffix(item)}
		{:else if declaredItemFormat(
			item,
			fieldName,
		) === 'truncated'}
			{declaredItemTextPrefix(item)}<TruncatedValue value={formatValue(entity[fieldName])} />{declaredItemTextSuffix(item)}
		{:else}
			{declaredItemTextPrefix(item)}{formatValue(entity[fieldName])}{declaredItemTextSuffix(item)}
		{/if}
	{:else}
		<span data-text="muted">{declaredItemDescription(item) ?? declaredItemLabel(item)}</span>
	{/if}
{/snippet}


{#snippet DeclaredPanel(panel: EntityView2DeclaredPanel<_EntityType>)}
	{@const renderer = declaredRenderer(
		panel.slot,
		panel.kind,
	)}
	{@const transform = declaredPanelTransform(panel)}
	{#if panel.kind === 'media' && renderer?.component === 'FileDetails' && declaredMedia !== undefined && declaredMedia.src !== undefined && declaredMedia.displayType !== undefined}
		<FileDetails
			src={entity[declaredMedia.src]}
			fileName={declaredMedia.title === undefined ? undefined : entity[declaredMedia.title]}
			extension={declaredMedia.extension === undefined ? undefined : entity[declaredMedia.extension]}
			contentType={declaredMedia.contentType === undefined ? undefined : entity[declaredMedia.contentType]}
			contentSize={declaredMedia.contentSize === undefined ? undefined : entity[declaredMedia.contentSize]}
			displayType={entity[declaredMedia.displayType]}
			text={declaredMedia.text === undefined ? undefined : entity[declaredMedia.text]}
		/>
	{:else if panel.kind === 'transform' && renderer?.component === 'IpfsCidAlternateEncodings' && transform?.field !== undefined}
		<IpfsCidAlternateEncodings
			target={String(entity[transform.field])}
			contentPath={'contentPath' in entitySelector ? String(entitySelector.contentPath) : ''}
		/>
	{:else if renderer?.component === 'SwarmBrowseForm'}
		<SwarmBrowseForm selector={entitySelector} />
	{:else}
		<ul>
			{#each panel.items ?? [] as item (declaredItemKey(item))}
				{#if declaredItemShouldShow(
					item,
					open,
				)}
					<li>{@render DeclaredItemValue(item)}</li>
				{/if}
			{/each}
		</ul>
	{/if}
{/snippet}


<ResourceBoundary
	resource={entity}
	placeholderText={placeholderText ?? `Loading ${title ?? entityType}…`}
>
	{#snippet children(entity)}
		{@const context = {
			entity,
			entitySelector,
			open,
		}}
		<EntityView
			{entityType}
			{entitySelector}
			{title}
			{href}
			{idDragPlainText}
			{layout}
			{collapsible}
			{showTypeAnnotation}
			bind:open
			{Icon}
			TypeAnnotationTooltip={TypeAnnotationTooltip ?? (entityDescription === undefined ? undefined : DefaultTypeAnnotationTooltip)}
			{CollapsibleProps}
			Content={hasContent ? EntityContent : undefined}
			Details={hasDetails ? EntityDetailsContent : undefined}
		>
			{#snippet Value()}
				{#if ValueContent}
					{@render ValueContent(context)}
				{:else if ValueSnippet}
					{@render ValueSnippet()}
				{:else if firstPresentDeclaredItem(declaredSummaryValue) !== undefined}
					{@render DeclaredItemValue(firstPresentDeclaredItem(declaredSummaryValue))}
				{:else if closed[0] !== undefined}
					{#if closed[0].Render}
						{@render closed[0].Render(context)}
					{:else if closed[0].text !== undefined}
						{closed[0].text}
					{:else if closed[0].field !== undefined && entity[closed[0].field] !== undefined}
						{formatValue(entity[closed[0].field])}
					{/if}
				{:else if declaredClosed[0] !== undefined}
					{@render DeclaredItemValue(declaredClosed[0])}
				{/if}
			{/snippet}

			{#snippet Title()}
				{#if TitleContent}
					{@render TitleContent(context)}
				{:else if TitleSnippet}
					{@render TitleSnippet()}
				{:else if title !== undefined}
					{title}
				{:else if firstPresentDeclaredItem(declaredSummaryTitle) !== undefined}
					{@render DeclaredItemValue(firstPresentDeclaredItem(declaredSummaryTitle))}
				{:else if closed[0] !== undefined}
					{#if closed[0].Render}
						{@render closed[0].Render(context)}
					{:else if closed[0].text !== undefined}
						{closed[0].text}
					{:else if closed[0].field !== undefined && entity[closed[0].field] !== undefined}
						{formatValue(entity[closed[0].field])}
					{/if}
				{:else if declaredClosed[0] !== undefined}
					{@render DeclaredItemValue(declaredClosed[0])}
				{/if}
			{/snippet}

			{#if hasHeadingAfter}
				{#snippet HeadingAfter()}
					{#if HeadingAfterContent}
						{@render HeadingAfterContent(context)}
					{:else if HeadingAfterSnippet}
						{@render HeadingAfterSnippet()}
					{:else}
						{#each declaredSummaryAfter as item (declaredItemKey(item))}
							{#if declaredItemShouldShow(
								item,
								open,
							)}
								<span data-text="muted">{@render DeclaredItemValue(item)}</span>
							{/if}
						{/each}
					{/if}
				{/snippet}
			{/if}

			{#snippet EntityContent(contentContext: {
				open?: boolean,
			})}
				{@const contentOpen = contentContext.open}
				{#if ContentSnippet}
					{@render ContentSnippet({
						title,
						href,
						open: contentOpen,
					})}
				{/if}

				{#if ContentSnippet === undefined && closed.length === 0 && declaredClosed.length > 1 && contentOpen !== true}
					<dl data-column-item="center">
						{#each declaredClosed.slice(1) as item (declaredItemKey(item))}
							{#if declaredItemShouldShow(
								item,
								contentOpen,
							)}
								<div>
									<dt>{declaredItemLabel(item)}</dt>
									<dd>{@render DeclaredItemValue(item)}</dd>
								</div>
							{/if}
						{/each}
					</dl>
				{/if}

				{#if closed.length > 1 && contentOpen !== true}
					<dl data-column-item="center">
						{#each closed.slice(1) as item (item.field ?? item.text ?? item.Render)}
							<div>
								<dt>{item.field ?? ''}</dt>
								<dd>
									{#if item.Render}
										{@render item.Render({
											...context,
											open: contentOpen,
										})}
									{:else if item.text !== undefined}
										{item.text}
									{:else if item.field !== undefined && entity[item.field] !== undefined}
										{formatValue(entity[item.field])}
									{/if}
								</dd>
							</div>
						{/each}
					</dl>
				{/if}

				{#each content?.dl ?? [] as detailList (detailList.id)}
					<dl data-column-item="center">
						{#each detailList.items as item (item.id)}
							{#if shouldShow(
								item.when,
								contentOpen,
							)}
								<div>
									<dt>{item.label}</dt>
									<dd>
										{#if item.Render}
											{@render item.Render({
												...context,
												open: contentOpen,
											})}
										{:else if item.text !== undefined}
											{item.text}
										{:else if item.field !== undefined && entity[item.field] !== undefined}
											{formatValue(entity[item.field])}
										{/if}
									</dd>
								</div>
							{/if}
						{/each}
					</dl>
				{/each}

				{#if ContentSnippet === undefined && content === undefined}
					{#if declaredMetrics.length > 0}
						<dl data-column-item="center">
							<SocialMetricSnapshotRows
								metrics={declaredMetrics.flatMap((metric) => (
									metric.field === undefined || entity[metric.field] === undefined || entity[metric.field] === null ?
										[]
									:
										[{
											label: metric.label ?? fieldDefinitionByName[metric.field]?.label ?? metric.field,
											value: Number(entity[metric.field]),
										}]
								))}
							/>
						</dl>
					{/if}

					{#each declaredContentDl as detailList, detailListIndex (detailListIndex)}
						<dl data-column-item="center">
							{#each detailList as item (declaredItemKey(item))}
								{#if declaredItemShouldShow(
									item,
									contentOpen,
								)}
									<div>
										<dt>{declaredItemLabel(item)}</dt>
										<dd>{@render DeclaredItemValue(item)}</dd>
									</div>
								{/if}
							{/each}
						</dl>
					{/each}

					{#each declaredContentBlocks as block, blockIndex (blockIndex)}
						<section>
							{#each block as item (declaredItemKey(item))}
								{#if declaredItemShouldShow(
									item,
									contentOpen,
								)}
									{#if declaredItemBlock(item) !== undefined || declaredItemMetrics(item) !== undefined}
										{@render DeclaredItemValue(item)}
									{:else}
										<p>{@render DeclaredItemValue(item)}</p>
									{/if}
								{/if}
							{/each}
						</section>
					{/each}
				{/if}

				{#each content?.blocks ?? [] as block (block.id)}
					{#if shouldShow(
						block.when,
						contentOpen,
					)}
						{@render block.Content({
							...context,
							open: contentOpen,
						})}
					{/if}
				{/each}

				{#if ContentAfter}
					{@render ContentAfter({
						...context,
						open: contentOpen,
					})}
				{/if}
			{/snippet}

			{#snippet EntityDetailsContent(detailsContext: {
				open?: boolean,
			})}
				{@const detailsOpen = detailsContext.open}
				{#if DetailsSnippet}
					{@render DetailsSnippet({
						open: detailsOpen,
					})}
				{/if}

				{#if DetailsSnippet === undefined && details === undefined && declaredPanels.length > 0}
					{#each declaredPanels as panel (panel.id)}
						{#if declaredConditionShouldShow(panel.when)}
							<section>
								<HeadingComponent>
									{panel.label}
								</HeadingComponent>

								{@render DeclaredPanel(panel)}
							</section>
						{/if}
					{/each}
				{/if}

				{#if details === undefined && declaredDetailCarousels.length > 0}
					{#each declaredDetailCarousels as carousel (carousel.id ?? carousel.label)}
						{#if shouldShow(
							carousel.when,
							detailsOpen,
						)}
							<CollapsibleTabs1
								id={`${stringify(entitySelector)}:${carousel.id ?? carousel.label}`}
								data-card
							>
								{#snippet Summary()}
									<header
										data-row-item="flexible"
										data-row="wrap gap-4"
									>
										<HeadingComponent>
											{carousel.label}
										</HeadingComponent>
									</header>
								{/snippet}

								{#snippet Markers()}
									{#each carousel.sections as section (section.id)}
										{#if declaredSectionShouldShow(
											section,
											detailsOpen,
										)}
											<a
												data-scroll-marker-label={section.label}
												href={`#${declaredSectionId(
													carousel,
													section,
												)}`}
											>{section.label}</a>
										{/if}
									{/each}
								{/snippet}

								{#snippet body()}
									{#each carousel.sections as section (section.id)}
										{#if declaredSectionShouldShow(
											section,
											detailsOpen,
										)}
											<section id={declaredSectionId(
												carousel,
												section,
											)}>
												{#if section.field !== undefined && section.List !== undefined}
													{@render section.List({
														id: declaredSectionId(
															carousel,
															section,
														),
														label: section.label,
														open: detailsOpen,
														selection: selection[EntityProxyField](section.field)(section.selection),
													})}
												{:else if section.Content}
													{@render section.Content({
														entity,
														entitySelector,
														id: declaredSectionId(
															carousel,
															section,
														),
														label: section.label,
														open: detailsOpen,
													})}
												{:else}
													<HeadingComponent>
														{section.label}
													</HeadingComponent>

													<ul>
														{#each section.items ?? [] as item (declaredItemKey(item))}
															{#if declaredItemShouldShow(
																item,
																detailsOpen,
															)}
																<li>{@render DeclaredItemValue(item)}</li>
															{/if}
														{/each}
													</ul>
												{/if}
											</section>
										{/if}
									{/each}
								{/snippet}
							</CollapsibleTabs1>
						{/if}
					{/each}
				{/if}

				{#if DetailsSnippet === undefined && details === undefined && declaredLists.length > 0}
					{#each declaredLists as list (list.id)}
						{#if list.field !== undefined}
							<section>
								<HeadingComponent>
									{list.label}
								</HeadingComponent>

								<dl data-column-item="center">
									<div>
										<dt>{list.label}</dt>
										<dd>
											{@render DeclaredItemValue({
												field: list.field,
												label: list.label,
												listDisplay: 'selector',
												selection: list.query,
												ifNonEmpty: true,
												emptyText: list.emptyText ?? list.placeholderText ?? 'No rows',
											})}
										</dd>
									</div>
								</dl>
							</section>
						{/if}
					{/each}
				{/if}

				{#if DetailsSnippet === undefined && details === undefined && declaredDetailTabs.length > 0}
						<CollapsibleTabs1
							id={`${stringify(entitySelector)}:details`}
							data-card
						>
							{#snippet Summary()}
								<header
									data-row-item="flexible"
									data-row="wrap gap-4"
								>
									<HeadingComponent>
										Details
									</HeadingComponent>
								</header>
							{/snippet}

							{#snippet Markers()}
								{#each declaredDetailTabs as tab (tab.id ?? tab.label)}
									{#if shouldShow(
										tab.when,
										detailsOpen,
									)}
										<a
											data-scroll-marker-label={tab.label}
											href={`#${stringify(entitySelector)}:${tab.id ?? tab.label}`}
										>{tab.label}</a>
									{/if}
								{/each}
							{/snippet}

							{#snippet body()}
								{#each declaredDetailTabs as tab (tab.id ?? tab.label)}
									{#if shouldShow(
										tab.when,
										detailsOpen,
									)}
										<section id={`${stringify(entitySelector)}:${tab.id ?? tab.label}`}>
											<HeadingComponent>
												{tab.label}
											</HeadingComponent>

											{#if tab.Content}
												{@render tab.Content(context)}
											{:else}
												<ul>
													{#each tab.items ?? [] as item (declaredItemKey(item))}
														{#if declaredItemShouldShow(
															item,
															detailsOpen,
														)}
															<li>{@render DeclaredItemValue(item)}</li>
														{/if}
													{/each}
												</ul>
											{/if}
										</section>
									{/if}
								{/each}
							{/snippet}
						</CollapsibleTabs1>
					{/if}

					{#if DetailsSnippet === undefined && detailTabs.length > 0}
						<CollapsibleTabs1
							id={`${stringify(entitySelector)}:details`}
							data-card
						>
							{#snippet Summary()}
								<header
									data-row-item="flexible"
									data-row="wrap gap-4"
								>
									<HeadingComponent>
										{details?.label ?? 'Details'}
									</HeadingComponent>
								</header>
							{/snippet}

							{#snippet Markers()}
								{#each detailTabs as tab (tab.id)}
									<a
										data-scroll-marker-label={tab.label}
										href={`#${stringify(entitySelector)}:${tab.id}`}
									>{tab.label}</a>
								{/each}
							{/snippet}

							{#snippet body()}
								{#each detailTabs as tab (tab.id)}
									<section id={`${stringify(entitySelector)}:${tab.id}`}>
										{#if shouldShow(
											tab.when,
											detailsOpen,
										)}
											{@render tab.Content({
												...context,
												open: detailsOpen,
											})}
										{/if}
									</section>
								{/each}
							{/snippet}
						</CollapsibleTabs1>
					{/if}

					{#if DetailsSnippet === undefined && details === undefined}
						{#each declaredDetailItems as item (item.label)}
							<section>
								<HeadingComponent>
									{item.label}
								</HeadingComponent>

								<ul>
									{#each item.items as detailItem (declaredItemKey(detailItem))}
										{#if declaredItemShouldShow(
											detailItem,
											detailsOpen,
										)}
											<li>{@render DeclaredItemValue(detailItem)}</li>
										{/if}
									{/each}
								</ul>
							</section>
						{/each}
					{/if}

					{#if DetailsSnippet === undefined}
						{#each detailItems as item (item.id)}
							{#if shouldShow(
								item.when,
								detailsOpen,
							)}
								<section>
									<HeadingComponent>
										{item.label}
									</HeadingComponent>

									{@render item.Content({
										...context,
										open: detailsOpen,
									})}
								</section>
							{/if}
						{/each}
					{/if}
			{/snippet}
		</EntityView>
	{/snippet}
</ResourceBoundary>


{#snippet DefaultTypeAnnotationTooltip()}
	{#if entityDescription !== undefined}
		<p>{entityDescription}</p>
	{/if}
{/snippet}
