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
				label: 'contract',
			},
			{
				label: 'derived primary file',
			},
			{
				label: 'derived file count',
			},
		],
		content: {
			dl: [
				[
					{
						label: 'contract',
					},
					{
						label: 'derived primary file',
					},
					{
						label: 'derived file count',
					},
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Source files',
					items: [
						{
							label: 'files keyed by source path with source text preview',
						},
					],
				},
				{
					label: 'Verification',
					items: [
						{
							label: 'Sourcify-backed EvmContractVerification',
						},
					],
				},
				{
					label: 'Compilation',
					items: [
						{
							label: 'EvmContractCompilation',
						},
					],
				},
				{
					label: 'Source evidence',
					items: [
						{
							label: 'Sourcify files payload',
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
			selection: EntityProxyResource<typeof schema, EntityType.EvmContractSourceBundle>
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
	entityType={EntityType.EvmContractSourceBundle}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
