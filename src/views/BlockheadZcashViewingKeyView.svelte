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
				label: 'wallet id',
			},
			{
				label: 'network',
			},
			{
				label: 'key fingerprint',
			},
		],
		content: {
			dl: [
				[
					{
						label: 'wallet id',
					},
					{
						label: 'network',
					},
					{
						label: 'key fingerprint',
					},
					{
						label: 'key kind',
					},
					'pools',
					{
						label: 'account index',
					},
					{
						label: 'birthday height',
					},
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
