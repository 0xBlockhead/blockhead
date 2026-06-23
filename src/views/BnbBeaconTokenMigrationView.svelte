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
				label: 'token',
			},
			{
				label: 'target network',
			},
			{
				label: 'target address/contract',
			},
		],
		content: {
			dl: [
				[
					{
						label: 'token',
					},
					{
						label: 'target network',
					},
					{
						label: 'target address/contract',
					},
					{
						label: 'migration kind',
					},
					'amount',
					{
						label: 'target-chain evidence',
					},
					{
						label: 'mapping metadata',
					},
					{
						label: 'latest status',
					},
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Observations',
					items: [
						{
							label: 'timestamped migration/fusion status observations',
						},
					],
				},
				{
					label: 'Token',
					items: [
						{
							label: 'source BNB Beacon token',
						},
					],
				},
				{
					label: 'Target network',
					items: [
						{
							label: 'target Network row',
						},
					],
				},
				{
					label: 'Source evidence',
					items: [
						{
							label: 'fusion mapping payload',
						},
						{
							label: 'archive migration record',
						},
						{
							label: 'target-chain event evidence',
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
			selection: EntityProxyResource<typeof schema, EntityType.BnbBeaconTokenMigration>
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
	entityType={EntityType.BnbBeaconTokenMigration}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
