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
				label: 'token id',
			},
			{
				label: 'token type',
			},
			{
				label: 'supply type',
			},
		],
		content: {
			dl: [
				[
					{
						label: 'token id',
					},
					{
						label: 'token type',
					},
					{
						label: 'supply type',
					},
					'decimals',
					{
						label: 'latest name/symbol',
					},
					{
						label: 'latest treasury',
					},
					{
						label: 'latest supply',
					},
					{
						label: 'paused/deleted state',
					},
					{
						label: 'latest custom fee count',
					},
					{
						label: 'association count',
					},
					{
						label: 'NFT count',
					},
					{
						label: 'timestamp count',
					},
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Latest state',
					items: [
						{
							label: 'latest token-info observation',
						},
					],
				},
				{
					label: 'State history',
					items: [
						{
							label: 'timestamped token-info observations',
						},
					],
				},
				{
					label: 'Control keys',
					items: [
						{
							label: 'latest key fields',
						},
					],
				},
				{
					label: 'Custom fees',
					items: [
						{
							label: 'custom-fee rows from latest token-info observation',
						},
					],
				},
				{
					label: 'Account associations',
					items: [
						{
							label: 'token association rows',
						},
					],
				},
				{
					label: 'NFTs',
					items: [
						{
							label: 'NFT serial rows for non-fungible tokens',
						},
					],
				},
				{
					label: 'Transfers',
					items: [
						{
							label: 'token transfer rows',
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
			selection: EntityProxyResource<typeof schema, EntityType.HederaToken>
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
	entityType={EntityType.HederaToken}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
