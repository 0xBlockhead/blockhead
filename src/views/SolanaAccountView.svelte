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
			'pubkey',
			{
				label: 'owner program',
			},
		],
		content: {
			dl: [
				[
					{
						label: 'network',
					},
					'pubkey',
					{
						label: 'owner program',
					},
				],
				[
					{
						label: 'latest lamports/executable/rent/data snapshot',
					},
					{
						label: 'token-account count',
					},
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Account observations',
					items: [
						{
							label: 'slot-bounded account state observations',
						},
					],
				},
				{
					label: 'Owner program',
					items: [
						{
							label: 'owning Solana program',
						},
					],
				},
				{
					label: 'Token accounts',
					items: [
						{
							label: 'SPL token accounts owned by this pubkey',
						},
					],
				},
				{
					label: 'Transactions/instructions',
					items: [
						{
							label: 'instruction references when reached from transactions',
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
					label: 'Source evidence',
					items: [
						{
							label: 'getAccountInfo',
						},
						{
							label: 'getMultipleAccounts/getProgramAccounts when wired',
						},
						{
							label: 'indexer account payloads',
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
			selection: EntityProxyResource<typeof schema, EntityType.SolanaAccount>
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
	entityType={EntityType.SolanaAccount}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
