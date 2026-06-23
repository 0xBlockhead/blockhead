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
				label: 'observation time',
			},
			'source',
		],
		content: {
			dl: [
				[
					{
						label: 'token',
					},
					{
						label: 'observation time',
					},
					'source',
					'name',
					'symbol',
					{
						label: 'total supply',
					},
					{
						label: 'max supply',
					},
					{
						label: 'treasury',
					},
					{
						label: 'deleted flag',
					},
					{
						label: 'paused flag',
					},
					{
						label: 'custom fee count',
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
					label: 'Token',
					items: [
						{
							label: 'parent Hedera token',
						},
					],
				},
				{
					label: 'Supply/state',
					items: [
						{
							label: 'supply',
						},
						{
							label: 'treasury',
						},
						{
							label: 'deleted/paused',
						},
						{
							label: 'expiry fields',
						},
					],
				},
				{
					label: 'Control keys',
					items: [
						{
							label: 'supply/admin/freeze/wipe/KYC/pause/fee-schedule keys',
						},
					],
				},
				{
					label: 'Custom fees',
					items: [
						{
							label: 'custom-fee rows for this observed schedule',
						},
					],
				},
				{
					label: 'Source evidence',
					items: [
						{
							label: 'raw token-info payload',
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
			selection: EntityProxyResource<typeof schema, EntityType.HederaToken_Timestamp>
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
	entityType={EntityType.HederaToken_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
