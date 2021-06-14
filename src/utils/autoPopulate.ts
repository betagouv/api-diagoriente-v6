import { isArray } from 'lodash';
import { SelectionSetNode } from 'graphql';
import { PopulateOptions, model } from 'mongoose';

function findDoc(doc: any): any {
  if (!isArray(doc)) return doc;
  return findDoc(doc[0]);
}

function autoPopulate(
  doc: any,
  info?: SelectionSetNode,
  populateCondition: Record<string, any> = {},
  parent?: string,
): PopulateOptions[] {
  let r: PopulateOptions[] = [];
  info?.selections.forEach((node) => {
    if (node.kind === 'Field' && node.selectionSet) {
      const name = node.name.value;
      const path = parent ? `${parent}.${name}` : name;
      let type = doc[name];
      if (isArray(type)) type = findDoc(type);

      if (type) {
        if (type.ref) {
          const populateObject: PopulateOptions = {
            path,
            populate: autoPopulate(model(type.ref).schema.obj, node.selectionSet, populateCondition),
          };
          if (populateCondition[name]) {
            populateObject.match = populateCondition[name];
          }
          r.push(populateObject);
        } else r = [...r, ...autoPopulate(type, node.selectionSet, populateCondition, path)];
      }
    }
  });

  return r;
}

export default autoPopulate;
