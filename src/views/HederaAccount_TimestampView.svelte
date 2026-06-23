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
				label: 'observed time',
			},
			'source',
		],
		content: {
			dl: [
				[
					{
						label: 'account',
					},
					{
						label: 'observed time',
					},
					'source',
					'alias',
					{
						label: 'EVM address',
					},
					{
						label: 'key presence',
					},
					{
						label: 'receiver signature requirement',
					},
					'memo',
					{
						label: 'balance',
					},
					{
						label: 'deleted flag',
					},
					{
						label: 'staking target',
					},
					{
						label: 'pending reward',
					},
					{
						label: 'auto-renew period',
					},
					{
						label: 'expiry',
					},
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Account',
					items: [
						{
							label: 'parent Hedera account',
						},
					],
				},
				{
					label: 'Staking',
					items: [
						{
							label: 'staked node/account',
						},
						{
							label: 'decline reward',
						},
						{
							label: 'pending reward',
						},
					],
				},
				{
					label: 'Authorization/profile',
					items: [
						'key',
						'alias',
						{
							label: 'EVM address',
						},
						'memo',
						{
							label: 'receiver signature setting',
						},
					],
				},
				{
					label: 'Source evidence',
					items: [
						{
							label: 'freshness',
						},
						{
							label: 'raw account payload',
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
			selection: EntityProxyResource<typeof schema, EntityType.HederaAccount_Timestamp>
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
	entityType={EntityType.HederaAccount_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
