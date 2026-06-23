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
				label: 'readiness check',
			},
			{
				label: 'kind',
			},
			{
				label: 'latest status',
			},
		],
		content: {
			dl: [
				[
					{
						label: 'session action',
					},
					{
						label: 'check id',
					},
					{
						label: 'kind',
					},
					{
						label: 'network/account/asset selectors',
					},
					{
						label: 'EVM account/token/spender shortcuts',
					},
					{
						label: 'capability key',
					},
					{
						label: 'required amount',
					},
					{
						label: 'created time',
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
					label: 'Status history',
					items: [
						{
							label: 'BlockheadActionReadinessCheck_Timestamp list',
						},
					],
				},
				{
					label: 'Session action',
					items: [
						{
							label: 'BlockheadSessionActionView',
						},
					],
				},
				{
					label: 'Source evidence',
					items: [
						{
							label: 'linked balance/allowance/capability rows when implemented',
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
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadActionReadinessCheck>
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
	entityType={EntityType.BlockheadActionReadinessCheck}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
