import { useGetSetContext } from '$/context/useContext.ts'

const {
	get: getIsInsideEntityList,
	set: setIsInsideEntityList,
} = useGetSetContext<boolean>(
	Symbol('isInsideEntityList')
)

export {
	getIsInsideEntityList,
	setIsInsideEntityList,
}
