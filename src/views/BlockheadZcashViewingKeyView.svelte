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
		'walletId',
		'$network',
		'keyFingerprint',
	],
	content: {
		dl: [
			[
				'walletId',
				'$network',
				'keyFingerprint',
				'keyKind',
				'pools',
			],
			[
				'accountIndex',
				'birthdayHeight',
				{
					label: 'incoming/outgoing/spend capability flags',
				},
				{
					label: 'imported time',
				},
				{
					label: 'latest scanned height',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Latest scan',
				items: [
					{
						label: 'latest viewing-key scan observation',
					},
				],
			},
			{
				label: 'Scan history',
				items: [
					{
						label: 'timestamped viewing-key scan observations',
					},
				],
			},
			{
				label: 'Wallet',
				items: [
					{
						label: 'parent local Zcash wallet state',
					},
				],
			},
			{
				label: 'Capabilities',
				items: [
					{
						label: 'incoming/outgoing/spend booleans by pool',
					},
				],
			},
			{
				label: 'Key material',
				items: [
					{
						label: 'redacted unified/Sapling/Orchard viewing or spending key string with local reveal controls',
					},
				],
			},
		],
	},
	lists: [
		{
			id: 'timestamps',
			label: 'timestamps',
			field: '$$timestamps',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
	],
} satisfies ComponentProps<typeof EntityView2>['view']

	let {
		selection,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadZcashViewingKey>
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
	entityType={EntityType.BlockheadZcashViewingKey}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
