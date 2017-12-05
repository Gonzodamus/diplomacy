class UnitSerializer < ActiveModel::Serializer
  attributes :id, :unit_type, :coast, :territory
  belongs_to :country
end
