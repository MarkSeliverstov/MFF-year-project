#
# How you should write the class with properties
#

# @ei-class: CarExample
# @ei-description: This class represents a car object.
class Car:
    # @ei-property: label 
    # @ei-description: This property represents the label of the car.
    label = ""

    # @ei-property: color 
    color = ""

    # @ei-property: year 
    # @ei-description: This property represents the year of the car.
    year = 0

    def __init__(self, label, color, year):
        self.label = label
        self.color = color
        self.year = year

    # @ei-method: Drive 
    # @ei-description: This method represents the drive action of the car.
    def Drive(self):
        pass

    # @ei-method: Stop
    def Stop(self):
        pass
