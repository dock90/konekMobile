import { AssetFieldsInterface } from '../queries/AssetQueries';
import { CloudinaryInfo } from '../queries/MeQueries';

export function avatarUri(
  asset: AssetFieldsInterface,
  cloudinaryInfo: CloudinaryInfo
): string {
  return `https://res.cloudinary.com/${cloudinaryInfo.cloudName}/${asset.resourceType}/${asset.type}/c_fit,h_100,q_auto,w_100/v1/${asset.publicId}.${asset.format}`;
}

export function thumbnailUri(
  asset: AssetFieldsInterface,
  cloudinaryInfo: CloudinaryInfo
): string {
  return `https://res.cloudinary.com/${cloudinaryInfo.cloudName}/${asset.resourceType}/${asset.type}/c_limit,q_auto,dpr_auto,w_150,h_150/v1/${asset.publicId}.${asset.format}`;
}

export function fullSizeUri(
  asset: AssetFieldsInterface,
  cloudinaryInfo: CloudinaryInfo
): string {
  return `https://res.cloudinary.com/${cloudinaryInfo.cloudName}/${asset.resourceType}/${asset.type}/c_limit,q_auto,dpr_auto,w_1500,h_1500/v1/${asset.publicId}.${asset.format}`;
}

export function originalPath(
  asset: AssetFieldsInterface,
  cloudinaryInfo: CloudinaryInfo
): string {
  return `https://res.cloudinary.com/${cloudinaryInfo.cloudName}/${asset.resourceType}/${asset.type}/v1/${asset.publicId}.${asset.format}`;
}
