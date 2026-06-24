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
			label: 'collection',
		},
		{
			label: 'token key',
		},
		{
			label: 'token id',
		},
	],
	content: {
		dl: [
			[
				{
					label: 'collection',
				},
				{
					label: 'token key',
				},
				{
					label: 'token id',
				},
				{
					label: 'asset object',
				},
				{
					label: 'metadata link',
				},
				{
					label: 'usage-right observation count',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Collection',
				items: [
					{
						label: 'parent NFT collection',
					},
				],
			},
			{
				label: 'Asset object',
				items: [
					{
						label: 'linked AssetObject when canonical object identity is available',
					},
				],
			},
			{
				label: 'Metadata',
				items: [
					{
						label: 'linked token metadata document',
					},
				],
			},
			{
				label: 'Usage-right observations',
				items: [
					{
						label: 'timestamped usage-right observations',
					},
				],
			},
			{
				label: 'Ownership/balance evidence',
				items: [
					{
						label: 'token transfers or future account-scoped ownership/balance rows',
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
			selection: EntityProxyResource<typeof schema, EntityType.NftToken>
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
	entityType={EntityType.NftToken}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
