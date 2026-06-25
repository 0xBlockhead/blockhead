<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// State
	const view = {
	closed: [
		'objectId',
		'objectFormat',
		'byteSource',
	],
	content: {
		dl: [
			[
				'objectId',
				'objectFormat',
				'byteSource',
				'timestampMs',
				'source',
			],
			[
				'verifier',
				'status',
				'objectKind',
				'computedObjectId',
				'canonicalEncoding',
			],
			[
				'headerBytesHash',
				'payloadBytesHash',
				'error',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Object',
				items: [
					{
						label: 'parsed Git object when verification succeeds',
					},
				],
			},
			{
				label: 'Byte source',
				items: [
					{
						label: 'loose/packed storage context when available',
					},
				],
			},
			{
				label: 'Diagnostics',
				items: [
					{
						label: 'verifier output when retained',
					},
				],
			},
		],
	},
} satisfies ComponentProps<typeof EntityView2>['view']

	let {
		selection,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.GitObjectVerification_Timestamp>
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView2>,
			| 'layout'
			| 'showTypeAnnotation'
		>
	> = $props()


	// Components
	import EntityView2 from '$/components/EntityView2.svelte'
</script>


<EntityView2
	{selection}
	entityType={EntityType.GitObjectVerification_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
