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
		'subjectKey',
		'rightKey',
		'timestampMs',
	],
	content: {
		dl: [
			[
				'subjectKey',
				'rightKey',
				'timestampMs',
				'source',
				'sourceKind',
				'rightKind',
			],
			[
				{
					label: 'asset object/token',
				},
				{
					label: 'user/account selector',
				},
				{
					label: 'expiry',
				},
				'ledgerCoordinateKind',
				'contractAddress',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Subject',
				items: [
					{
						label: 'AssetObject preferred',
					},
					{
						label: 'NftToken facade when only collection-scoped token identity is available',
					},
				],
			},
			{
				label: 'User',
				items: [
					{
						label: 'account identity when resolved',
					},
				],
			},
			{
				label: 'Format support',
				items: [
					{
						label: 'ERC-4907/interface evidence observation',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'userOf/userExpires call',
					},
					{
						label: 'event',
					},
					{
						label: 'explicit license entitlement',
					},
					{
						label: 'or local entitlement record',
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
			selection: EntityProxyResource<typeof schema, EntityType.UsageRight_Timestamp>
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
	entityType={EntityType.UsageRight_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
