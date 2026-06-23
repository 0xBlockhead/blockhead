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
				label: 'observed time/source',
			},
			{
				label: 'voting power',
			},
		],
		content: {
			dl: [
				[
					{
						label: 'validator',
					},
					{
						label: 'observed time/source',
					},
					{
						label: 'voting power',
					},
					{
						label: 'stake',
					},
					'status',
					{
						label: 'jailed flag',
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
							label: 'parent validator identity',
						},
					],
				},
				{
					label: 'Power/status',
					items: [
						{
							label: 'voting power',
						},
						{
							label: 'stake',
						},
						'status',
						{
							label: 'jailed flag',
						},
					],
				},
				{
					label: 'History',
					items: [
						{
							label: 'BnbValidator_Timestamp list',
						},
					],
				},
				{
					label: 'Source evidence',
					items: [
						{
							label: 'archive/API/explorer validator payload',
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
			selection: EntityProxyResource<typeof schema, EntityType.BnbValidator_Timestamp>
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
	entityType={EntityType.BnbValidator_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
