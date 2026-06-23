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
				label: 'subnet id',
			},
			'label',
			'threshold',
		],
		content: {
			dl: [
				[
					{
						label: 'subnet id',
					},
					'label',
					'threshold',
					{
						label: 'owner address count',
					},
					{
						label: 'control key count',
					},
					{
						label: 'chain count',
					},
					{
						label: 'validator count',
					},
					{
						label: 'delegator count',
					},
					{
						label: 'latest total stake',
					},
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Blockchains',
					items: [
						{
							label: 'blockchains in this subnet',
						},
					],
				},
				{
					label: 'Validators',
					items: [
						{
							label: 'validator intervals for this subnet',
						},
					],
				},
				{
					label: 'Delegators',
					items: [
						{
							label: 'delegator intervals for this subnet',
						},
					],
				},
				{
					label: 'Control keys',
					items: [
						{
							label: 'threshold/owner/control-key list',
						},
					],
				},
				{
					label: 'State observations',
					items: [
						{
							label: 'timestamped subnet stake/count observations',
						},
					],
				},
				{
					label: 'Source evidence',
					items: [
						{
							label: 'getSubnets/getCurrentValidators payloads',
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
			selection: EntityProxyResource<typeof schema, EntityType.AvalancheSubnet>
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
	entityType={EntityType.AvalancheSubnet}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
