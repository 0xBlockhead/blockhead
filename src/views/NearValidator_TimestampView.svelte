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
				label: 'validator',
			},
			{
				label: 'epoch id/height',
			},
			'source',
		],
		content: {
			dl: [
				[
					{
						label: 'validator',
					},
					{
						label: 'epoch id/height',
					},
					'source',
					{
						label: 'role',
					},
					{
						label: 'public key',
					},
					{
						label: 'stake',
					},
					{
						label: 'slashed flag',
					},
					{
						label: 'expected/produced blocks',
					},
					{
						label: 'chunks',
					},
					{
						label: 'shard count',
					},
					{
						label: 'kickout reason',
					},
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Validator',
					items: [
						{
							label: 'parent NEAR validator',
						},
					],
				},
				{
					label: 'Network epoch',
					items: [
						{
							label: 'NEAR network epoch/head observation',
						},
					],
				},
				{
					label: 'Account',
					items: [
						{
							label: 'validator NEAR account',
						},
					],
				},
				{
					label: 'Source evidence',
					items: [
						{
							label: 'validators RPC current_validators/next_validators/current_proposals/fishermen/prev_epoch_kickout payload',
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
			selection: EntityProxyResource<typeof schema, EntityType.NearValidator_Timestamp>
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
	entityType={EntityType.NearValidator_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
