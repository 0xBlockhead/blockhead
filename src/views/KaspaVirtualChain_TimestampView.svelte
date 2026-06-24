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
			label: 'start hash',
		},
		{
			label: 'observed time/source',
		},
	],
	content: {
		dl: [
			[
				{
					label: 'network',
				},
				{
					label: 'start hash',
				},
				{
					label: 'observed time/source',
				},
				{
					label: 'confirmation buffer',
				},
				{
					label: 'added block count',
				},
				{
					label: 'removed block count',
				},
				{
					label: 'accepted transaction count',
				},
				{
					label: 'next checkpoint',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Added blocks',
				items: [
					{
						label: 'added virtual-chain block hashes',
					},
				],
			},
			{
				label: 'Removed blocks',
				items: [
					{
						label: 'rollback block hashes',
					},
				],
			},
			{
				label: 'Accepted transactions',
				items: [
					{
						label: 'accepted transactions grouped by accepting block',
					},
				],
			},
			{
				label: 'Rollback effects',
				items: [
					{
						label: 'accepted transactions invalidated by removed blocks',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'getVirtualChainFromBlock',
					},
					{
						label: 'getVirtualChainFromBlockV2',
					},
					{
						label: 'or SubscribeVirtualChainChanged payload',
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
			selection: EntityProxyResource<typeof schema, EntityType.KaspaVirtualChain_Timestamp>
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
	entityType={EntityType.KaspaVirtualChain_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
