import { AssetInterface } from '../queries/AssetQueries';
import { CloudinaryInfo } from '../queries/MeQueries';

export function avatarUri(
  asset: AssetInterface,
  cloudinaryInfo: CloudinaryInfo
): string {
  return `https://res.cloudinary.com/${cloudinaryInfo.cloudName}/${asset.resourceType}/${asset.type}/c_fit,h_200,q_auto,w_200/v1/${asset.publicId}.${asset.format}`;
}

export function thumbnailUri(
  asset: AssetInterface,
  cloudinaryInfo: CloudinaryInfo
): string {
  return `https://res.cloudinary.com/${cloudinaryInfo.cloudName}/${asset.resourceType}/${asset.type}/c_limit,q_auto,dpr_auto,w_300,h_300/v1/${asset.publicId}.${asset.format}`;
}

export function fullSizeUri(
  asset: AssetInterface,
  cloudinaryInfo: CloudinaryInfo
): string {
  return `https://res.cloudinary.com/${cloudinaryInfo.cloudName}/${asset.resourceType}/${asset.type}/c_limit,q_auto,dpr_auto,w_1500,h_1500/v1/${asset.publicId}.${asset.format}`;
}

export function originalPath(
  asset: AssetInterface,
  cloudinaryInfo: CloudinaryInfo
): string {
  return `https://res.cloudinary.com/${cloudinaryInfo.cloudName}/${asset.resourceType}/${asset.type}/v1/${asset.publicId}.${asset.format}`;
}
