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
				label: 'account',
			},
			{
				label: 'signer key',
			},
			{
				label: 'signer type',
			},
		],
		content: {
			dl: [
				[
					{
						label: 'account',
					},
					{
						label: 'signer key',
					},
					{
						label: 'signer type',
					},
					{
						label: 'latest weight/sponsor observation',
					},
					{
						label: 'latest ledger state',
					},
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Signer snapshots',
					items: [
						{
							label: 'timestamped signer weight/sponsor observations',
						},
					],
				},
				{
					label: 'Account',
					items: [
						{
							label: 'parent Stellar account',
						},
					],
				},
				{
					label: 'Source evidence',
					items: [
						{
							label: 'Horizon account signers array',
						},
						{
							label: 'RPC AccountEntry ledger data',
						},
						{
							label: 'indexer account history',
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
			selection: EntityProxyResource<typeof schema, EntityType.StellarAccountSigner>
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
	entityType={EntityType.StellarAccountSigner}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
