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
		'$assetInstance',
		'formatId',
		'confidence',
	],
	content: {
		dl: [
			[
				'$assetInstance',
				'formatId',
				'timestampMs',
				'source',
				'confidence',
				'evidenceKind',
				'ledgerCoordinateKind',
			],
			[
				'interfaceId',
				{
					label: 'program/module/contract/token program',
				},
				'notes',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Asset',
				items: [
					'$assetInstance',
				],
			},
			{
				label: 'Format semantics',
				items: [
					{
						label: 'formatId enum/catalog label',
					},
					{
						label: 'standard/spec reference from constants',
					},
				],
			},
			{
				label: 'Extensions',
				items: [
					{
						label: 'TokenProgramExtension_Timestamp observations filtered by asset',
					},
				],
			},
			{
				label: 'Regulated controls',
				items: [
					{
						label: 'regulated asset profile when format implies compliance/issuer controls',
					},
				],
			},
			{
				label: 'Class/object rows',
				items: [
					{
						label: 'class/object rows when format implies slot/partition/token id/object identity',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'supportsInterface or ABI evidence',
					},
					{
						label: 'program owner/account data',
					},
					{
						label: 'module/resource type',
					},
					{
						label: 'indexer classification',
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
			selection: EntityProxyResource<typeof schema, EntityType.AssetFormatSupport_Timestamp>
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
	entityType={EntityType.AssetFormatSupport_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
