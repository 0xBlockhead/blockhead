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
				label: 'vote pubkey',
			},
			{
				label: 'node pubkey',
			},
		],
		content: {
			dl: [
				[
					{
						label: 'network',
					},
					{
						label: 'vote pubkey',
					},
					{
						label: 'node pubkey',
					},
				],
				[
					{
						label: 'latest stake/commission/delinquency snapshot',
					},
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Validator observations',
					items: [
						{
							label: 'slot/source validator vote-account observations',
						},
					],
				},
				{
					label: 'Network',
					items: [
						{
							label: 'parent Solana network',
						},
					],
				},
				{
					label: 'Vote account',
					items: [
						{
							label: 'Solana account when resolved',
						},
					],
				},
				{
					label: 'Stake/status',
					items: [
						{
							label: 'activated stake',
						},
						{
							label: 'commission',
						},
						{
							label: 'delinquency',
						},
					],
				},
				{
					label: 'Source evidence',
					items: [
						{
							label: 'getVoteAccounts current/delinquent payload',
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
			selection: EntityProxyResource<typeof schema, EntityType.SolanaValidator>
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
	entityType={EntityType.SolanaValidator}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
