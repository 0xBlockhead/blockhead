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
				label: 'namespace/reference/address',
			},
			{
				label: 'address kind',
			},
			{
				label: 'optional label',
			},
		],
		content: {
			dl: [
				[
					'namespace',
					'reference',
					{
						label: 'account address',
					},
					{
						label: 'address kind',
					},
					{
						label: 'canonical address',
					},
					{
						label: 'network when resolved',
					},
				],
				[
					'label',
					{
						label: 'public key presence',
					},
					{
						label: 'derivation path presence',
					},
					'capabilities',
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Network',
					items: [
						{
							label: 'NetworkView when CAIP-2/reference resolves',
						},
					],
				},
				{
					label: 'Native account',
					items: [
						{
							label: 'Account/native account view when linked by selector',
						},
					],
				},
				{
					label: 'Connections',
					items: [
						{
							label: 'BlockheadWalletConnection rows that exposed the account',
						},
					],
				},
				{
					label: 'Capabilities',
					items: [
						{
							label: 'account-level sign/send/list/watch/delegate capabilities supplied by the session',
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
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadWalletAccount>
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
	entityType={EntityType.BlockheadWalletAccount}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
