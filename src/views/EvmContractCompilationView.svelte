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
		'language',
		'compiler',
		'compilerVersion',
	],
	content: {
		dl: [
			[
				'language',
				'compiler',
				'compilerVersion',
				'fullyQualifiedName',
				{
					label: 'truncated compiler settings JSON',
				},
				{
					label: 'truncated storage layout JSON',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Contract',
				items: [
					{
						label: 'EvmContract',
					},
				],
			},
			{
				label: 'Compiler',
				items: [
					'language',
					'compiler',
					{
						label: 'version',
					},
					'fullyQualifiedName',
				],
			},
			{
				label: 'Settings',
				items: [
					'compilerSettingsJson',
				],
			},
			{
				label: 'Storage layout',
				items: [
					'storageLayoutJson',
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
				label: 'Source evidence',
				items: [
					{
						label: 'Sourcify contract lookup compilation/metadata payload',
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
			selection: EntityProxyResource<typeof schema, EntityType.EvmContractCompilation>
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
	entityType={EntityType.EvmContractCompilation}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
