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
		'$mint',
		'slot',
		'source',
	],
	content: {
		dl: [
			[
				'$mint',
				'slot',
				'source',
				'timestampMs',
				'supply',
			],
			[
				'decimals',
				{
					label: 'mint authority',
				},
				{
					label: 'freeze authority',
				},
				{
					label: 'initialized flag',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Mint',
				items: [
					{
						label: 'parent Solana token mint',
					},
				],
			},
			{
				label: 'Authorities',
				items: [
					{
						label: 'Solana account refs',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'parsed mint account payload',
					},
					{
						label: 'RPC context',
					},
				],
			},
			{
				label: 'Token accounts',
				items: [
					{
						label: 'bounded token-account list for the same mint when sourceable',
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
			selection: EntityProxyResource<typeof schema, EntityType.SolanaTokenMint_Timestamp>
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
	entityType={EntityType.SolanaTokenMint_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
