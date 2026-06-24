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
		{
			label: 'network',
		},
		{
			label: 'CID',
		},
		{
			label: 'from actor',
		},
	],
	content: {
		dl: [
			[
				{
					label: 'network',
				},
				{
					label: 'CID',
				},
				{
					label: 'from actor',
				},
				{
					label: 'to actor',
				},
				{
					label: 'method number',
				},
				'nonce',
				{
					label: 'value in attoFIL',
				},
				{
					label: 'gas limit',
				},
				{
					label: 'fee cap',
				},
				{
					label: 'premium',
				},
				{
					label: 'receipt count',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'From',
				items: [
					{
						label: 'from Filecoin actor',
					},
				],
			},
			{
				label: 'To',
				items: [
					{
						label: 'to Filecoin actor',
					},
				],
			},
			{
				label: 'Receipts',
				items: [
					{
						label: 'Filecoin message receipts',
					},
				],
			},
			{
				label: 'Blocks/tipsets',
				items: [
					{
						label: 'block/tipset refs when source context provides inclusion',
					},
				],
			},
			{
				label: 'Params',
				items: [
					{
						label: 'raw params preview when source-backed',
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
			selection: EntityProxyResource<typeof schema, EntityType.FilecoinMessage>
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
	entityType={EntityType.FilecoinMessage}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
