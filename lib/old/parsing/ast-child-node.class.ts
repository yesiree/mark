import { InternalRule } from '../private.interface'
import { AstNode } from './ast-node.class'

export interface AstChildNode extends AstNode {
  rule: InternalRule
  parent?: AstNode
  meta: any[]
  text: string[]
}
